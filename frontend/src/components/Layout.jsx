import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut, User, LayoutDashboard, Settings, BookOpen, GraduationCap, Users, CreditCard, CalendarRange, MessageSquare, Clock, FileText, ClipboardList, Receipt, TrendingUp, Award, CalendarPlus, BadgeCheck, ClipboardEdit, UserPlus, Bell, Image, CalendarClock, ClipboardCheck, BookCopy, Send, SearchCheck, Landmark, ShieldAlert, Signal } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, currentPath }) => {
    const isActive = currentPath.startsWith(to);
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
        >
            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span>{label}</span>
            {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
            )}
        </Link>
    );
};

export default function Layout() {
    const { user, role, logout } = useAuthStore();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Define links based on role
    let links = [];
    if (role === 'SUPERADMIN') {
        links = [
            { to: '/superadmin/dashboard', icon: LayoutDashboard, label: 'Command Center' },
            { to: '/superadmin/users', icon: Users, label: 'User Directory Control' },
            { to: '/superadmin/finances', icon: Landmark, label: 'Fees & Financials' },
            { to: '/superadmin/academics', icon: BookOpen, label: 'Academic Control' },
            { to: '/superadmin/exams', icon: ShieldAlert, label: 'Exam Master Control' },
            { to: '/superadmin/communications', icon: Signal, label: 'Communication Hub' },
            { to: '/superadmin/settings', icon: Settings, label: 'System Settings' },
            { to: '/superadmin/profile', icon: User, label: 'My Profile' },
        ];
    } else if (role === 'ADMIN') {
        links = [
            { to: '/admin/dashboard', icon: LayoutDashboard, label: 'HQ Dashboard' },
            { to: '/admin/academics', icon: BookOpen, label: 'Academics & Routine' },
            { to: '/admin/users', icon: Users, label: 'Staff & Students' },
            { to: '/admin/routine', icon: CalendarPlus, label: 'Class Routine Generation' },
            { to: '/admin/exam-routine', icon: CalendarClock, label: 'Exam Routine' },
            { to: '/admin/duty-chart', icon: ClipboardCheck, label: 'Duty Chart' },
            { to: '/admin/copy-allocation', icon: BookCopy, label: 'Exam Copy Allocation' },
            { to: '/admin/script-distribution', icon: Send, label: 'Answer Script Distribution' },
            { to: '/admin/marks-inspection', icon: SearchCheck, label: 'Marks Entry Inspection' },
            { to: '/admin/push-notification', icon: Bell, label: 'Push Notification' },
            { to: '/admin/push-gallery', icon: Image, label: 'Push Gallery Photo' },
            { to: '/admin/profile', icon: User, label: 'My Profile' },
        ];
    } else if (role === 'CLERK') {
        links = [
            { to: '/clerk/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/clerk/profile', icon: User, label: 'Profile Edit' },
            { to: '/clerk/admission', icon: UserPlus, label: 'Admission to New Class' },
            { to: '/clerk/id-cards', icon: BadgeCheck, label: 'ID Card Generation' },
            { to: '/clerk/certificates', icon: Award, label: 'Character Certificate Generation' },
            { to: '/clerk/fees', icon: Receipt, label: 'Fees Collection Receipt' },
            { to: '/clerk/ledger', icon: TrendingUp, label: 'Income Expenditure' },
            { to: '/clerk/push-notification', icon: Bell, label: 'Push Notification' },
            { to: '/clerk/push-gallery', icon: Image, label: 'Push Gallery Photo' },
            { to: '/clerk/leave', icon: CalendarRange, label: 'Leave Request' },
            { to: '/clerk/feedback', icon: MessageSquare, label: 'Feedback' },
        ];
    } else if (role === 'TEACHER') {
        links = [
            { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/teacher/profile', icon: User, label: 'Profile Edit' },
            { to: '/teacher/routine', icon: Clock, label: 'Show Routine' },
            { to: '/teacher/classes', icon: Users, label: 'Class Management' },
            { to: '/teacher/marks', icon: ClipboardList, label: 'Marks Entry' },
            { to: '/teacher/marksheet', icon: FileText, label: 'Marksheet Generation' },
            { to: '/teacher/leave', icon: CalendarRange, label: 'Leave Request' },
            { to: '/teacher/feedback', icon: MessageSquare, label: 'Feedback' },
        ];
    } else if (role === 'STUDENT') {
        links = [
            { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/student/registration', icon: ClipboardEdit, label: 'Registration' },
            { to: '/student/profile', icon: User, label: 'Profile Edit' },
            { to: '/student/routine', icon: Clock, label: 'Show Routine' },
            { to: '/student/results', icon: GraduationCap, label: 'Show Result' },
            { to: '/student/leave', icon: CalendarRange, label: 'Leave Request' },
            { to: '/student/fees', icon: CreditCard, label: 'Fees Amount' },
            { to: '/student/complaints', icon: MessageSquare, label: 'Feedback' },
        ];
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-10">
                <div className="h-20 flex items-center px-8 border-b border-gray-50">
                    <div className="flex items-center gap-3 text-indigo-600">
                        <GraduationCap className="w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight text-gray-900">EduManage</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                    <div className="px-4 pb-4 mb-4 border-b border-gray-50">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
                        {links.map((link) => (
                            <SidebarLink key={link.to} {...link} currentPath={location.pathname} />
                        ))}
                    </div>
                </div>

                {/* User Card */}
                <div className="p-4 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-gray-500 font-medium capitalize truncate">
                                {role.toLowerCase()}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pl-72">
                <div className="max-w-7xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
