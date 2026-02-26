from app.core.database import Base
from app.models.user import User
from app.models.academic import ClassRoom, Section, Subject
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.result import Result
from app.models.finance import Fee, LedgerTransaction
from app.models.communication import LeaveRequest, Complaint
from app.models.routine import Timetable
from app.models.admin_ops import AuditLog, SystemSetting

# This ensures all models are loaded when Alembic imports this module,
# allowing Alembic to detect the metadata and create the migrations correctly.
