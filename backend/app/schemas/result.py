from pydantic import BaseModel
from typing import Optional
from datetime import date

class ResultBase(BaseModel):
    exam_name: str
    marks_obtained: float
    total_marks: float
    grade: Optional[str] = None
    date_published: date

class ResultCreate(ResultBase):
    student_id: int
    subject_id: int

class ResultInDBBase(ResultBase):
    id: int
    student_id: int
    subject_id: int
    teacher_id: int

    class Config:
        from_attributes = True

class ResultResponse(ResultInDBBase):
    pass
