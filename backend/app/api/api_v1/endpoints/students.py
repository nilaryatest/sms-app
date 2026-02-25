from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.profiles import StudentProfile
from app.schemas.student import StudentProfileUpdate, StudentProfileResponse
from app.api.dependencies import get_current_active_user

router = APIRouter()

@router.get("/section/{section_id}", response_model=List[StudentProfileResponse])
def get_students_by_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.TEACHER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    students = db.query(StudentProfile).filter(StudentProfile.section_id == section_id).all()
    return students

@router.get("/me", response_model=StudentProfileResponse)
def read_student_profile_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="User is not a student")
        
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    return profile
