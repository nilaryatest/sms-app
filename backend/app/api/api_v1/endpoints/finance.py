from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_active_user
from app.models.user import User, UserRole
from app.models.finance import Fee, LedgerTransaction, TransactionType, FeeStatus
from app.schemas.finance import FeeCreate, FeeUpdate, FeeResponse, LedgerCreate, LedgerResponse

router = APIRouter()

def check_clerk_or_admin(user: User):
    if user.role not in [UserRole.CLERK, UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Finance privileges required")

# --- Fees ---
@router.post("/fees", response_model=FeeResponse)
def create_fee(fee_in: FeeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_clerk_or_admin(current_user)
    fee = Fee(**fee_in.dict())
    db.add(fee)
    db.commit()
    db.refresh(fee)
    return fee

@router.get("/fees", response_model=List[FeeResponse])
def get_fees(student_id: int = None, status: FeeStatus = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_clerk_or_admin(current_user)
    query = db.query(Fee)
    if student_id:
        query = query.filter(Fee.student_id == student_id)
    if status:
        query = query.filter(Fee.status == status)
    return query.all()

@router.get("/fees/me", response_model=List[FeeResponse])
def get_my_fees(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can view their own fees here.")
    return db.query(Fee).filter(Fee.student_id == current_user.id).all()

@router.put("/fees/{fee_id}", response_model=FeeResponse)
def update_fee(fee_id: int, fee_in: FeeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_clerk_or_admin(current_user)
    fee = db.query(Fee).filter(Fee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found")
    
    fee.paid_amount = fee_in.paid_amount
    fee.status = fee_in.status
    db.commit()
    db.refresh(fee)
    return fee

# --- Ledger ---
@router.post("/ledger", response_model=LedgerResponse)
def create_ledger_entry(ledger_in: LedgerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_clerk_or_admin(current_user)
    entry = LedgerTransaction(**ledger_in.dict(), recorded_by_id=current_user.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/ledger", response_model=List[LedgerResponse])
def get_ledger(skip: int = 0, limit: int = 100, type: TransactionType = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_clerk_or_admin(current_user)
    query = db.query(LedgerTransaction)
    if type:
        query = query.filter(LedgerTransaction.type == type)
    return query.order_by(LedgerTransaction.timestamp.desc()).offset(skip).limit(limit).all()
