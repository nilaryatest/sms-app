from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.result import Result
from app.schemas.result import ResultCreate, ResultResponse
from app.api.dependencies import get_current_active_user
from app.models.profiles import TeacherProfile, StudentProfile

router = APIRouter()

@router.post("/", response_model=ResultResponse)
def create_result(
    result_in: ResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(status_code=403, detail="Only teachers can upload results.")
        
    teacher_profile = db.query(TeacherProfile).filter(TeacherProfile.user_id == current_user.id).first()
    if not teacher_profile:
        raise HTTPException(status_code=404, detail="Teacher profile not found.")
        
    result = Result(
        **result_in.model_dump(),
        teacher_id=teacher_profile.id
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

@router.get("/me", response_model=List[ResultResponse])
def get_my_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="User is not a student")
        
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    results = db.query(Result).filter(Result.student_id == student_profile.id).all()
    return results

@router.get("/student/{student_id}", response_model=List[ResultResponse])
def get_student_results(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only Admin, Teacher or the Student themselves can see these results
    # (Simplified: Admin/Teacher only for now)
    if current_user.role not in [UserRole.ADMIN, UserRole.TEACHER]:
         raise HTTPException(status_code=403, detail="Not enough permissions")
         
    results = db.query(Result).filter(Result.student_id == student_id).all()
    return results
