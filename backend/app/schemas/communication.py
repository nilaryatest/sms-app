from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.communication import RequestStatus

# --- Leave Requests ---
class LeaveRequestBase(BaseModel):
    start_date: date
    end_date: date
    reason: str

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestUpdate(BaseModel):
    status: RequestStatus

class LeaveRequestResponse(LeaveRequestBase):
    id: int
    student_id: int
    status: RequestStatus
    created_at: datetime

    class Config:
        orm_mode = True

# --- Complaints ---
class ComplaintBase(BaseModel):
    subject: str
    message: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: RequestStatus

class ComplaintResponse(ComplaintBase):
    id: int
    user_id: int
    status: RequestStatus
    timestamp: datetime

    class Config:
        orm_mode = True
