import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Project, AdminUser
from app.schemas import ProjectOut, ProjectCreate, ProjectUpdate
from app.auth import get_current_admin

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectOut])
def get_projects(
    category: Optional[str] = Query(None, description="Filter by category (e.g. Full-Stack, Backend)"),
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    all_projects: bool = Query(False, description="Include unpublished (Admin only)"),
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if not all_projects:
        query = query.filter(Project.is_published == True)
    if category and category != "All":
        query = query.filter(Project.category == category)
    if featured is not None:
        query = query.filter(Project.featured == featured)
    return query.order_by(Project.order.asc(), Project.id.asc()).all()

@router.get("/admin/all", response_model=List[ProjectOut])
def get_all_projects_admin(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Project).order_by(Project.order.asc(), Project.id.asc()).all()

@router.get("/{slug}", response_model=ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with slug '{slug}' not found"
        )
    return project

@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with slug '{project_in.slug}' already exists"
        )
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # If slug is changing, verify no conflict
    if project_in.slug and project_in.slug != project.slug:
        existing = db.query(Project).filter(Project.slug == project_in.slug).first()
        if existing and existing.id != project_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Project with slug '{project_in.slug}' already exists"
            )

    update_data = project_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project

@router.post("/{project_id}/duplicate", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def duplicate_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """Duplicate an existing project as a draft with a unique slug."""
    orig = db.query(Project).filter(Project.id == project_id).first()
    if not orig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    unique_suffix = uuid.uuid4().hex[:6]
    dup_slug = f"{orig.slug}-copy-{unique_suffix}"

    dup_project = Project(
        slug=dup_slug,
        title=f"{orig.title} (Copy)",
        summary=orig.summary,
        problem=orig.problem,
        solution=orig.solution,
        features=list(orig.features) if orig.features else [],
        architecture=orig.architecture,
        learnings=orig.learnings,
        tech=list(orig.tech) if orig.tech else [],
        category=orig.category,
        status=orig.status,
        image=orig.image,
        gallery=list(orig.gallery) if orig.gallery else [],
        live=orig.live,
        repo=orig.repo,
        featured=False,
        order=orig.order + 1 if orig.order is not None else 1,
        is_published=False,
        short_description=orig.short_description,
        full_description=orig.full_description,
        start_date=orig.start_date,
        end_date=orig.end_date
    )
    db.add(dup_project)
    db.commit()
    db.refresh(dup_project)
    return dup_project

@router.patch("/{project_id}/publish", response_model=ProjectOut)
def toggle_publish_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """Toggle publish / draft status of a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project.is_published = not bool(project.is_published)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()
    return None
