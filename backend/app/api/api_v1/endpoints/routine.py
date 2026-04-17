from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_active_user
from app.models.user import User, UserRole
from app.models.routine import Timetable, DayOfWeek
from app.schemas.routine import TimetableCreate, TimetableUpdate, TimetableResponse

router = APIRouter()

def check_admin(user: User):
    if user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.CLERK]:
        raise HTTPException(status_code=403, detail="Admin or Clerk privileges required")

# --- Timetables (Routines) ---
@router.post("/", response_model=TimetableResponse)
def create_routine_entry(routine_in: TimetableCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_admin(current_user)
    
    # Conflict check (naive implementation: same teacher, same day, same time)
    conflict = db.query(Timetable).filter(
        Timetable.teacher_id == routine_in.teacher_id,
        Timetable.day_of_week == routine_in.day_of_week,
        Timetable.start_time < routine_in.end_time,
        Timetable.end_time > routine_in.start_time
    ).first()
    if conflict:
        raise HTTPException(status_code=400, detail="Teacher already has a class scheduled at this time.")
        
    entry = Timetable(**routine_in.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/", response_model=List[TimetableResponse])
def get_routines(
    class_id: int = None, 
    section_id: int = None, 
    teacher_id: int = None, 
    day: DayOfWeek = None,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Timetable)
    if class_id:
        query = query.filter(Timetable.class_id == class_id)
    if section_id:
        query = query.filter(Timetable.section_id == section_id)
    if teacher_id:
        query = query.filter(Timetable.teacher_id == teacher_id)
    if day:
        query = query.filter(Timetable.day_of_week == day)
        
    return query.order_by(Timetable.day_of_week, Timetable.start_time).all()

@router.get("/me", response_model=List[TimetableResponse])
def get_my_routine(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role == UserRole.TEACHER:
        return db.query(Timetable).filter(Timetable.teacher_id == current_user.id).order_by(Timetable.day_of_week, Timetable.start_time).all()
    elif current_user.role == UserRole.STUDENT and current_user.student_profile:
        # A student's routine is based on their assigned class and section
        return db.query(Timetable).filter(
            Timetable.class_id == current_user.student_profile.class_id,
            Timetable.section_id == current_user.student_profile.section_id
        ).order_by(Timetable.day_of_week, Timetable.start_time).all()
    else:
        raise HTTPException(status_code=400, detail="Profile incomplete or role not supported for direct routine fetch.")

@router.put("/{entry_id}", response_model=TimetableResponse)
def update_routine_entry(entry_id: int, routine_in: TimetableUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_admin(current_user)
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Routine entry not found")
    
    update_data = routine_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(entry, key, value)
        
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
def delete_routine_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_admin(current_user)
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Routine entry not found")
    
    db.delete(entry)
    db.commit()
    return {"detail": "Routine entry deleted successfully"}
