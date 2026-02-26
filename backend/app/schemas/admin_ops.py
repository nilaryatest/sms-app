from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource: str
    timestamp: datetime
    ip_address: Optional[str]

    class Config:
        orm_mode = True

class SystemSettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingResponse(SystemSettingBase):
    class Config:
        orm_mode = True
