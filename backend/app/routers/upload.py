import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_admin
from app.models import AdminUser, MediaAsset, SiteSettings, Profile
from app.config import settings
from app.storage import get_storage_adapter

router = APIRouter(prefix="/upload", tags=["Uploads & Media"])

ALLOWED_IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
ALLOWED_PDF_MIMES = {"application/pdf"}

def validate_magic_bytes(file_bytes: bytes, content_type: str, filename: str) -> None:
    """Validate magic bytes to prevent forged MIME types."""
    ext = os.path.splitext(filename)[1].lower()

    if content_type == "application/pdf" or ext == ".pdf":
        if not file_bytes.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid PDF document: missing %PDF header."
            )
        return

    # Image magic byte verification
    if file_bytes.startswith(b"\xff\xd8\xff"): # JPEG
        return
    elif file_bytes.startswith(b"\x89PNG\r\n\x1a\n"): # PNG
        return
    elif file_bytes.startswith(b"GIF87a") or file_bytes.startswith(b"GIF89a"): # GIF
        return
    elif len(file_bytes) >= 12 and file_bytes[:4] == b"RIFF" and file_bytes[8:12] == b"WEBP": # WEBP
        return
    elif b"<svg" in file_bytes[:200].lower() or b"<?xml" in file_bytes[:100].lower(): # SVG
        return

    # If content type claimed to be image but doesn't match standard signatures:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"File signature does not match supported image or PDF formats (Filename: {filename})."
    )

@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    """Secure image/file upload handler with server-side validation and MediaAsset persistence."""
    content_type = (file.content_type or "").lower()
    filename = file.filename or "upload.bin"
    ext = os.path.splitext(filename)[1].lower()

    # Verify extension matches allowed extensions
    if content_type not in settings.ALLOWED_IMAGE_TYPES and ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{content_type}'. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )

    # Read file contents and verify size limit
    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB"
        )

    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # Perform magic-byte validation
    validate_magic_bytes(file_bytes, content_type, filename)

    # Save via persistent adapter
    storage = get_storage_adapter()
    media_info = storage.save_media(file_bytes, filename, content_type)

    # Save record to media_assets table
    media_asset = MediaAsset(
        filename=filename,
        public_id=media_info.get("public_id"),
        url=media_info.get("url", ""),
        secure_url=media_info.get("secure_url", media_info.get("url", "")),
        format=media_info.get("format"),
        size_bytes=media_info.get("size_bytes", len(file_bytes)),
        width=media_info.get("width"),
        height=media_info.get("height"),
        content_type=content_type
    )
    db.add(media_asset)
    db.commit()
    db.refresh(media_asset)

    return {
        "id": media_asset.id,
        "url": media_asset.secure_url,
        "secure_url": media_asset.secure_url,
        "filename": media_asset.filename,
        "size": media_asset.size_bytes,
        "width": media_asset.width,
        "height": media_asset.height,
        "format": media_asset.format,
        "content_type": media_asset.content_type,
        "created_at": media_asset.created_at
    }

@router.post("/resume", status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    """Dedicated secure PDF resume upload endpoint."""
    content_type = (file.content_type or "").lower()
    filename = file.filename or "resume.pdf"

    if not (content_type in ALLOWED_PDF_MIMES or filename.lower().endswith(".pdf")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Resume must be a PDF document."
        )

    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Resume exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB"
        )

    validate_magic_bytes(file_bytes, "application/pdf", filename)

    storage = get_storage_adapter()
    media_info = storage.save_media(file_bytes, filename, "application/pdf")
    resume_url = media_info.get("secure_url", media_info.get("url", "/resume.pdf"))

    # Update SiteSettings and Profile resume URLs
    settings_obj = db.query(SiteSettings).first()
    if settings_obj:
        settings_obj.resume_url = resume_url
        settings_obj.default_resume_url = resume_url

    profile = db.query(Profile).first()
    if profile:
        profile.resume_url = resume_url

    db.commit()

    return {
        "url": resume_url,
        "secure_url": resume_url,
        "filename": filename,
        "size": len(file_bytes)
    }
