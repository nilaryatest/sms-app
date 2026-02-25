from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import dependencies
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.academic import ClassRoom, Section, Subject
from app.schemas import academic as schemas

router = APIRouter()

# --- Classes ---
@router.post("/classes/", response_model=schemas.ClassRoom)
def create_class(
    class_in: schemas.ClassRoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_class = ClassRoom(name=class_in.name)
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@router.get("/classes/", response_model=List[schemas.ClassRoom])
def read_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user)
):
    return db.query(ClassRoom).all()

# --- Sections ---
@router.post("/sections/", response_model=schemas.Section)
def create_section(
    section_in: schemas.SectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Verify class exists
    db_class = db.query(ClassRoom).filter(ClassRoom.id == section_in.class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
        
    db_section = Section(name=section_in.name, class_id=section_in.class_id)
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section

@router.get("/sections/", response_model=List[schemas.Section])
def read_sections(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user)
):
    return db.query(Section).all()

# --- Subjects ---
@router.post("/subjects/", response_model=schemas.Subject)
def create_subject(
    subject_in: schemas.SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    db_subject = Subject(name=subject_in.name, code=subject_in.code)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/subjects/", response_model=List[schemas.Subject])
def read_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_active_user)
):
    return db.query(Subject).all()
