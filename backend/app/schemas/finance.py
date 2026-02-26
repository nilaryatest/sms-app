from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.models.finance import FeeStatus, TransactionType

# --- Fees ---
class FeeBase(BaseModel):
    student_id: int
    academic_year: str
    total_amount: float
    due_date: date

class FeeCreate(FeeBase):
    pass

class FeeUpdate(BaseModel):
    paid_amount: float
    status: FeeStatus

class FeeResponse(FeeBase):
    id: int
    paid_amount: float
    status: FeeStatus
    
    class Config:
        orm_mode = True

# --- Ledger ---
class LedgerBase(BaseModel):
    amount: float
    type: TransactionType
    category: str
    description: Optional[str] = None

class LedgerCreate(LedgerBase):
    pass

class LedgerResponse(LedgerBase):
    id: int
    timestamp: datetime
    recorded_by_id: int

    class Config:
        orm_mode = True
