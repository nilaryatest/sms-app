from pydantic import BaseModel
from typing import Optional, List
from datetime import time
from app.models.routine import DayOfWeek

# --- Timetables (Routines) ---
class TimetableBase(BaseModel):
    class_id: int
    section_id: int
    subject_id: int
    teacher_id: int
    day_of_week: DayOfWeek
    start_time: time
    end_time: time

class TimetableCreate(TimetableBase):
    pass

class TimetableUpdate(BaseModel):
    subject_id: Optional[int]
    teacher_id: Optional[int]
    start_time: Optional[time]
    end_time: Optional[time]

class TimetableResponse(TimetableBase):
    id: int

    class Config:
        orm_mode = True
