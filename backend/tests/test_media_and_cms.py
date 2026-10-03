import io
import pytest
from PIL import Image

def generate_test_image(format="PNG", size=(100, 100), color="blue") -> bytes:
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()

def test_media_upload_and_list(client, auth_headers):
    # 1. Upload valid image
    img_bytes = generate_test_image("PNG", (200, 150), "red")
    files = {"file": ("test_pic.png", img_bytes, "image/png")}

    res = client.post("/api/v1/upload", headers=auth_headers, files=files)
    assert res.status_code == 201
    data = res.json()
    assert "url" in data
    assert data["filename"] == "test_pic.png"
    assert data["width"] == 200
    assert data["height"] == 150
    asset_id = data["id"]

    # 2. List media in media library
    res_list = client.get("/api/v1/media", headers=auth_headers)
    assert res_list.status_code == 200
    items = res_list.json()
    assert len(items) >= 1
    found = any(item["id"] == asset_id for item in items)
    assert found

    # 3. Search media
    res_search = client.get("/api/v1/media?q=test_pic", headers=auth_headers)
    assert res_search.status_code == 200
    assert len(res_search.json()) >= 1

def test_media_delete_safety(client, auth_headers):
    # 1. Upload image
    img_bytes = generate_test_image("JPEG", (120, 120), "green")
    files = {"file": ("banner.jpg", img_bytes, "image/jpeg")}
    res = client.post("/api/v1/upload", headers=auth_headers, files=files)
    assert res.status_code == 201
    asset_id = res.json()["id"]
    asset_url = res.json()["url"]

    # 2. Reference this image in a project
    proj_res = client.post("/api/v1/projects", headers=auth_headers, json={
        "slug": "media-safety-project",
        "title": "Media Safety Project",
        "summary": "Summary",
        "problem": "Problem",
        "solution": "Solution",
        "category": "Backend",
        "tech": ["Python"],
        "features": ["Feat 1"],
        "image": asset_url
    })
    assert proj_res.status_code == 201
    proj_id = proj_res.json()["id"]

    # 3. Try to delete the media asset without force -> should return 409 Conflict
    del_res = client.delete(f"/api/v1/media/{asset_id}", headers=auth_headers)
    assert del_res.status_code == 409
    assert "actively referenced" in del_res.json()["detail"]

    # 4. Cleanup project and delete safely
    client.delete(f"/api/v1/projects/{proj_id}", headers=auth_headers)
    del_res2 = client.delete(f"/api/v1/media/{asset_id}", headers=auth_headers)
    assert del_res2.status_code == 204

def test_resume_upload_validation(client, auth_headers):
    # Valid PDF
    fake_pdf = b"%PDF-1.4\n%test pdf content\n%%EOF"
    files = {"file": ("resume.pdf", fake_pdf, "application/pdf")}
    res = client.post("/api/v1/upload/resume", headers=auth_headers, files=files)
    assert res.status_code == 201
    assert "url" in res.json()

    # Invalid fake PDF
    fake_bad = b"This is not a pdf file"
    bad_files = {"file": ("resume.pdf", fake_bad, "application/pdf")}
    bad_res = client.post("/api/v1/upload/resume", headers=auth_headers, files=bad_files)
    assert bad_res.status_code == 400

def test_social_links_crud(client, auth_headers):
    # Create
    res = client.post("/api/v1/social-links", headers=auth_headers, json={
        "platform": "LeetCode",
        "url": "https://leetcode.com/u/J9d9l9n9/",
        "icon": "leetcode",
        "order": 1,
        "is_active": True
    })
    assert res.status_code == 201
    link_id = res.json()["id"]

    # Read Public
    pub_res = client.get("/api/v1/social-links")
    assert pub_res.status_code == 200
    assert any(item["id"] == link_id for item in pub_res.json())

    # Update
    up_res = client.put(f"/api/v1/social-links/{link_id}", headers=auth_headers, json={
        "platform": "LeetCode Updated",
        "url": "https://leetcode.com/u/J9d9l9n9/",
        "icon": "leetcode",
        "order": 2
    })
    assert up_res.status_code == 200
    assert up_res.json()["platform"] == "LeetCode Updated"

    # Delete
    del_res = client.delete(f"/api/v1/social-links/{link_id}", headers=auth_headers)
    assert del_res.status_code == 204

def test_project_duplicate_and_publish(client, auth_headers):
    # 1. Create project
    proj_res = client.post("/api/v1/projects", headers=auth_headers, json={
        "slug": "original-project",
        "title": "Original Project",
        "summary": "Summary",
        "problem": "Problem",
        "solution": "Solution",
        "category": "Full-Stack",
        "tech": ["React", "FastAPI"],
        "features": ["Feat 1"],
        "is_published": True
    })
    assert proj_res.status_code == 201
    orig_id = proj_res.json()["id"]

    # 2. Duplicate project
    dup_res = client.post(f"/api/v1/projects/{orig_id}/duplicate", headers=auth_headers)
    assert dup_res.status_code == 201
    dup_data = dup_res.json()
    assert "copy" in dup_data["slug"]
    assert dup_data["is_published"] is False
    dup_id = dup_data["id"]

    # 3. Toggle publish
    pub_toggle = client.patch(f"/api/v1/projects/{dup_id}/publish", headers=auth_headers)
    assert pub_toggle.status_code == 200
    assert pub_toggle.json()["is_published"] is True

    # Cleanup
    client.delete(f"/api/v1/projects/{orig_id}", headers=auth_headers)
    client.delete(f"/api/v1/projects/{dup_id}", headers=auth_headers)

def test_unauthenticated_media_access(client):
    res = client.get("/api/v1/media")
    assert res.status_code == 401

    res_post = client.post("/api/v1/upload", files={"file": ("test.png", b"123", "image/png")})
    assert res_post.status_code == 401

def test_hero_image_update_and_persistence(client, auth_headers):
    """Regression test: verify Hero image can be uploaded, saved in profile, persisted in DB, and read via GET /profile."""
    # 1. Upload new Hero image
    hero_bytes = generate_test_image("JPEG", (480, 600), "purple")
    files = {"file": ("new_hero_portrait.jpg", hero_bytes, "image/jpeg")}
    upload_res = client.post("/api/v1/upload", headers=auth_headers, files=files)
    assert upload_res.status_code == 201
    new_hero_url = upload_res.json()["url"]
    assert new_hero_url.startswith("/uploads/") or "cloudinary" in new_hero_url or "http" in new_hero_url

    # 2. Update Profile with new hero_image
    update_res = client.put("/api/v1/profile", headers=auth_headers, json={
        "hero_image": new_hero_url,
        "hero_image_position": "center 30%"
    })
    assert update_res.status_code == 200
    updated_profile = update_res.json()
    assert updated_profile["hero_image"] == new_hero_url
    assert updated_profile["hero_image_position"] == "center 30%"
    assert updated_profile["name"] != ""  # Existing fields preserved

    # 3. Read via public GET /profile
    get_res = client.get("/api/v1/profile")
    assert get_res.status_code == 200
    public_profile = get_res.json()
    assert public_profile["hero_image"] == new_hero_url
    assert public_profile["hero_image_position"] == "center 30%"
