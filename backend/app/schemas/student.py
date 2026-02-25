from pydantic import BaseModel
from typing import Optional
from datetime import date

# Shared properties
class StudentProfileBase(BaseModel):
    roll_number: str
    enrollment_date: date
    section_id: Optional[int] = None

class StudentProfileCreate(StudentProfileBase):
    user_id: int

class StudentProfileUpdate(BaseModel):
    section_id: Optional[int] = None

class StudentProfileInDBBase(StudentProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class StudentProfileResponse(StudentProfileInDBBase):
    pass
