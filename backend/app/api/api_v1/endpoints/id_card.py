from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.profiles import StudentProfile
from app.api.dependencies import get_current_active_user

router = APIRouter()

@router.get("/generate/{student_id}")
async def generate_id_card(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.CLERK, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Only Admins or Clerks can generate ID cards.")
        
    student_profile = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")
        
    return {
        "success": True,
        "message": "ID Card Data Retrieved Successfully",
        "data": {
            "school_name": "Modern Lincoln High",
            "student_name": f"{student_profile.user.first_name} {student_profile.user.last_name}",
            "roll_number": student_profile.roll_number,
            "section": student_profile.section.name if student_profile.section else "N/A",
            "valid_until": "2027-05-31"
        }
    }
