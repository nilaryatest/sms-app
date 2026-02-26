import enum
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class FeeStatus(str, enum.Enum):
    PENDING = "PENDING"
    PARTIAL = "PARTIAL"
    PAID = "PAID"
    OVERDUE = "OVERDUE"

class TransactionType(str, enum.Enum):
    INCOME = "INCOME"
    EXPENDITURE = "EXPENDITURE"

class Fee(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    academic_year = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0.0)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(FeeStatus), default=FeeStatus.PENDING)

    student = relationship("User", backref="fees")

class LedgerTransaction(Base):
    __tablename__ = "ledger_transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    category = Column(String, nullable=False) # e.g., "Term 1 Fee", "Electricity Bill"
    description = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    recorded_by_id = Column(Integer, ForeignKey("users.id"), nullable=False) # Clerk/Admin who recorded it

    recorded_by = relationship("User")
