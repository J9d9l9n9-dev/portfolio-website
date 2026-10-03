import os
import io
import uuid
import abc
from typing import Dict, Any, Optional
from PIL import Image
from app.config import settings

def extract_image_dimensions(file_bytes: bytes, content_type: str) -> tuple[Optional[int], Optional[int], Optional[str]]:
    """Extract width, height and format from image bytes safely using Pillow."""
    if content_type == "application/pdf":
        return None, None, "pdf"
    try:
        with Image.open(io.BytesIO(file_bytes)) as img:
            img.verify()
        with Image.open(io.BytesIO(file_bytes)) as img:
            return img.width, img.height, img.format.lower() if img.format else None
    except Exception as e:
        print(f"Warning: could not extract image dimensions: {e}")
        return None, None, None

class BaseStorageAdapter(abc.ABC):
    @abc.abstractmethod
    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        """Saves file and returns public or accessible URL."""
        pass

    @abc.abstractmethod
    def save_media(self, file_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        """Saves media and returns full metadata dictionary."""
        pass

class LocalStorageAdapter(BaseStorageAdapter):
    def __init__(self, upload_dir: str):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        ext = os.path.splitext(filename)[1].lower()
        unique_name = f"{uuid.uuid4().hex[:12]}{ext}"
        target_path = os.path.join(self.upload_dir, unique_name)
        with open(target_path, "wb") as f:
            f.write(file_bytes)
        return f"/uploads/{unique_name}"

    def save_media(self, file_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        url = self.save_file(file_bytes, filename, content_type)
        width, height, fmt = extract_image_dimensions(file_bytes, content_type)
        ext = os.path.splitext(filename)[1].lstrip(".").lower()
        return {
            "url": url,
            "secure_url": url,
            "public_id": os.path.basename(url),
            "filename": filename,
            "format": fmt or ext or "bin",
            "size_bytes": len(file_bytes),
            "width": width,
            "height": height,
            "content_type": content_type
        }

class CloudinaryStorageAdapter(BaseStorageAdapter):
    def __init__(self, cloudinary_url: str):
        self.cloudinary_url = cloudinary_url

    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        res = self.save_media(file_bytes, filename, content_type)
        return res["secure_url"]

    def save_media(self, file_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        try:
            import cloudinary
            import cloudinary.uploader
            cloudinary.config(cloudinary_url=self.cloudinary_url)

            resource_type = "raw" if content_type == "application/pdf" else "auto"
            result = cloudinary.uploader.upload(
                file_bytes,
                folder="portfolio",
                resource_type=resource_type
            )

            url = result.get("url", "")
            secure_url = result.get("secure_url", url)
            public_id = result.get("public_id", "")
            width = result.get("width")
            height = result.get("height")
            fmt = result.get("format", os.path.splitext(filename)[1].lstrip(".").lower())

            return {
                "url": url,
                "secure_url": secure_url,
                "public_id": public_id,
                "filename": filename,
                "format": fmt,
                "size_bytes": result.get("bytes", len(file_bytes)),
                "width": width,
                "height": height,
                "content_type": content_type
            }
        except Exception as e:
            print(f"Cloudinary upload failed, falling back to local: {e}")
            local_adapter = LocalStorageAdapter(
                os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
            )
            return local_adapter.save_media(file_bytes, filename, content_type)

class S3StorageAdapter(BaseStorageAdapter):
    def __init__(self, bucket: str, region: str, endpoint_url: str = ""):
        self.bucket = bucket
        self.region = region
        self.endpoint_url = endpoint_url

    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        res = self.save_media(file_bytes, filename, content_type)
        return res["secure_url"]

    def save_media(self, file_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        try:
            import boto3
            session = boto3.session.Session()
            client_kwargs = {
                "service_name": "s3",
                "region_name": self.region,
                "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
                "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
            }
            if self.endpoint_url:
                client_kwargs["endpoint_url"] = self.endpoint_url
            s3 = session.client(**client_kwargs)

            ext = os.path.splitext(filename)[1].lower()
            key = f"portfolio/{uuid.uuid4().hex[:12]}{ext}"
            s3.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file_bytes,
                ContentType=content_type
            )

            if self.endpoint_url:
                url = f"{self.endpoint_url.rstrip('/')}/{self.bucket}/{key}"
            else:
                url = f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{key}"

            width, height, fmt = extract_image_dimensions(file_bytes, content_type)

            return {
                "url": url,
                "secure_url": url,
                "public_id": key,
                "filename": filename,
                "format": fmt or ext.lstrip("."),
                "size_bytes": len(file_bytes),
                "width": width,
                "height": height,
                "content_type": content_type
            }
        except Exception as e:
            print(f"S3 upload failed, falling back to local: {e}")
            local_adapter = LocalStorageAdapter(
                os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
            )
            return local_adapter.save_media(file_bytes, filename, content_type)

def get_storage_adapter() -> BaseStorageAdapter:
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    if (settings.STORAGE_TYPE == "cloudinary" or bool(settings.CLOUDINARY_URL)) and settings.CLOUDINARY_URL:
        return CloudinaryStorageAdapter(settings.CLOUDINARY_URL)
    elif settings.STORAGE_TYPE == "s3" and settings.AWS_S3_BUCKET:
        return S3StorageAdapter(settings.AWS_S3_BUCKET, settings.AWS_REGION, settings.S3_ENDPOINT_URL)
    return LocalStorageAdapter(upload_dir)
