import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Could be null if system action
    action = Column(String, nullable=False) # e.g. "CREATED_USER", "DELETED_RESULT"
    resource = Column(String, nullable=False) # e.g. "users", "results"
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)

    user = relationship("User", backref="audit_logs")

class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String, primary_key=True, index=True) # e.g., "active_academic_session", "grading_scale"
    value = Column(String, nullable=False)
    description = Column(String, nullable=True)
