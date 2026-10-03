from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Profile, AdminUser
from app.schemas import ProfileOut, ProfileUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please ensure database is seeded."
        )
    return profile

@router.put("", response_model=ProfileOut)
def update_profile(
    updates: ProfileUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
