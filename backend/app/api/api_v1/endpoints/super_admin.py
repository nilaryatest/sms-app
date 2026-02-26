from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_active_user
from app.models.user import User, UserRole
from app.models.admin_ops import AuditLog, SystemSetting
from app.schemas.admin_ops import AuditLogResponse, SystemSettingResponse, SystemSettingCreate

router = APIRouter()

def check_superadmin(user: User):
    if user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Super Admin privileges required")

# --- System Settings (Super Admin Only) ---
@router.get("/settings", response_model=List[SystemSettingResponse])
def get_settings(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_superadmin(current_user)
    return db.query(SystemSetting).all()

@router.put("/settings", response_model=SystemSettingResponse)
def update_setting(setting_in: SystemSettingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_superadmin(current_user)
    setting = db.query(SystemSetting).filter(SystemSetting.key == setting_in.key).first()
    if setting:
        setting.value = setting_in.value
        setting.description = setting_in.description
    else:
        setting = SystemSetting(key=setting_in.key, value=setting_in.value, description=setting_in.description)
        db.add(setting)
    
    db.commit()
    db.refresh(setting)
    return setting

# --- Audit Logs (Super Admin Only) ---
@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    check_superadmin(current_user)
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
