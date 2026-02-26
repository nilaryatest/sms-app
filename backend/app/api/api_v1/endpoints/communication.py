from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_active_user
from app.models.user import User, UserRole
from app.models.communication import LeaveRequest, Complaint, RequestStatus
from app.schemas.communication import LeaveRequestCreate, LeaveRequestUpdate, LeaveRequestResponse, ComplaintCreate, ComplaintUpdate, ComplaintResponse

router = APIRouter()

# --- Leave Requests ---
@router.post("/leaves", response_model=LeaveRequestResponse)
def create_leave_request(leave_in: LeaveRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can request leaves here.")
    
    leave = LeaveRequest(**leave_in.dict(), student_id=current_user.id)
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

@router.get("/leaves/me", response_model=List[LeaveRequestResponse])
def get_my_leaves(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can view their own leaves here.")
    return db.query(LeaveRequest).filter(LeaveRequest.student_id == current_user.id).order_by(LeaveRequest.created_at.desc()).all()

@router.get("/leaves", response_model=List[LeaveRequestResponse])
def get_all_leaves(status: RequestStatus = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.TEACHER]:
        raise HTTPException(status_code=403, detail="Not authorized to view all leaves")
    
    query = db.query(LeaveRequest)
    if status:
        query = query.filter(LeaveRequest.status == status)
    return query.order_by(LeaveRequest.created_at.desc()).all()

@router.put("/leaves/{leave_id}", response_model=LeaveRequestResponse)
def update_leave_status(leave_id: int, leave_in: LeaveRequestUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.TEACHER]:
        raise HTTPException(status_code=403, detail="Not authorized to approve/reject leaves")
    
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    
    leave.status = leave_in.status
    db.commit()
    db.refresh(leave)
    return leave

# --- Complaints (Feedback) ---
@router.post("/complaints", response_model=ComplaintResponse)
def create_complaint(complaint_in: ComplaintCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    complaint = Complaint(**complaint_in.dict(), user_id=current_user.id)
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint

@router.get("/complaints/me", response_model=List[ComplaintResponse])
def get_my_complaints(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(Complaint).filter(Complaint.user_id == current_user.id).order_by(Complaint.timestamp.desc()).all()

@router.get("/complaints", response_model=List[ComplaintResponse])
def get_all_complaints(status: RequestStatus = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to view all complaints")
    
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    return query.order_by(Complaint.timestamp.desc()).all()

@router.put("/complaints/{complaint_id}", response_model=ComplaintResponse)
def update_complaint_status(complaint_id: int, complaint_in: ComplaintUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to update complaints")
    
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint.status = complaint_in.status
    db.commit()
    db.refresh(complaint)
    return complaint
