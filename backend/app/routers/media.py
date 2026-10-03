from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import MediaAsset, Profile, SiteSettings, Project, Education, Experience, Certification, AdminUser
from app.schemas import MediaAssetOut
from app.auth import get_current_admin

router = APIRouter(prefix="/media", tags=["Media Library"])

@router.get("", response_model=List[MediaAssetOut])
def list_media_assets(
    q: Optional[str] = Query(None, description="Search query by filename, format, or type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    """List all stored media assets with optional search and pagination (Admin only)."""
    query = db.query(MediaAsset)
    if q and q.strip():
        search = f"%{q.strip()}%"
        query = query.filter(
            or_(
                MediaAsset.filename.ilike(search),
                MediaAsset.format.ilike(search),
                MediaAsset.content_type.ilike(search)
            )
        )
    return query.order_by(MediaAsset.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=MediaAssetOut)
def get_media_asset(
    id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    asset = db.query(MediaAsset).filter(MediaAsset.id == id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")
    return asset

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_asset(
    id: int,
    force: bool = Query(False, description="Force delete even if references exist"),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    """Safely delete a media asset, verifying that no live portfolio entities reference it."""
    asset = db.query(MediaAsset).filter(MediaAsset.id == id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")

    target_urls = {u for u in [asset.url, asset.secure_url] if u}

    if not force:
        references = []
        # Check profiles
        profile = db.query(Profile).first()
        if profile:
            if profile.hero_image in target_urls:
                references.append("Profile (Hero Image)")
            if profile.avatar_image in target_urls:
                references.append("Profile (Avatar Image)")
            if profile.about_image in target_urls:
                references.append("Profile (About Image)")
            if profile.resume_url in target_urls:
                references.append("Profile (Resume URL)")

        # Check site settings
        settings_obj = db.query(SiteSettings).first()
        if settings_obj:
            if settings_obj.og_image_url in target_urls:
                references.append("Site Settings (OG Image)")
            if settings_obj.favicon_url in target_urls:
                references.append("Site Settings (Favicon)")
            if settings_obj.default_profile_image in target_urls:
                references.append("Site Settings (Default Profile Image)")

        # Check projects
        projects = db.query(Project).all()
        for p in projects:
            if p.image in target_urls:
                references.append(f"Project '{p.title}' (Main Image)")
            if p.gallery and isinstance(p.gallery, list):
                for g_img in p.gallery:
                    if g_img in target_urls:
                        references.append(f"Project '{p.title}' (Gallery Image)")
                        break

        # Check education
        edu_list = db.query(Education).all()
        for ed in edu_list:
            if ed.logo_url in target_urls:
                references.append(f"Education '{ed.school}' (Logo)")

        # Check experience
        exp_list = db.query(Experience).all()
        for exp in exp_list:
            if exp.company_logo in target_urls:
                references.append(f"Experience '{exp.title}' (Logo)")

        # Check certifications
        certs = db.query(Certification).all()
        for cert in certs:
            if cert.badge_image in target_urls:
                references.append(f"Certification '{cert.title}' (Badge)")

        if references:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Cannot delete media asset because it is actively referenced by: {', '.join(references)}. Replace the image in those sections first or pass force=true."
            )

    db.delete(asset)
    db.commit()
    return None
