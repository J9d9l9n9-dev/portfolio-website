from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import SocialLink, AdminUser
from app.schemas import SocialLinkOut, SocialLinkCreate, SocialLinkUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/social-links", tags=["Social Links"])

@router.get("", response_model=List[SocialLinkOut])
def get_social_links(
    all_links: bool = False,
    db: Session = Depends(get_db)
):
    """Public endpoint to fetch active social links in order. Pass all_links=True if admin."""
    query = db.query(SocialLink)
    if not all_links:
        query = query.filter(SocialLink.is_active == True)
    return query.order_by(SocialLink.order.asc(), SocialLink.id.asc()).all()

@router.post("", response_model=SocialLinkOut, status_code=status.HTTP_201_CREATED)
def create_social_link(
    link_in: SocialLinkCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    link = SocialLink(**link_in.model_dump())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link

@router.put("/{id}", response_model=SocialLinkOut)
def update_social_link(
    id: int,
    link_in: SocialLinkUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    link = db.query(SocialLink).filter(SocialLink.id == id).first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Social link not found")

    update_data = link_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(link, key, value)

    db.commit()
    db.refresh(link)
    return link

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_link(
    id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    link = db.query(SocialLink).filter(SocialLink.id == id).first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Social link not found")

    db.delete(link)
    db.commit()
    return None
