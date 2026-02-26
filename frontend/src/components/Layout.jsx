import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut, User, LayoutDashboard, Settings, BookOpen, GraduationCap, Users, CreditCard, CalendarRange, MessageSquare } from 'lucide-react';

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
            { to: '/superadmin/users', icon: Users, label: 'Master Accounts' },
            { to: '/superadmin/settings', icon: Settings, label: 'System Settings' },
            { to: '/superadmin/profile', icon: User, label: 'My Profile' },
        ];
    } else if (role === 'ADMIN') {
        links = [
            { to: '/admin/dashboard', icon: LayoutDashboard, label: 'HQ Dashboard' },
            { to: '/admin/academics', icon: BookOpen, label: 'Academics & Routine' },
            { to: '/admin/users', icon: Users, label: 'Staff & Students' },
            { to: '/admin/profile', icon: User, label: 'My Profile' },
        ];
    } else if (role === 'CLERK') {
        links = [
            { to: '/clerk/dashboard', icon: LayoutDashboard, label: 'Financial Office' },
            { to: '/clerk/fees', icon: CreditCard, label: 'Fee Collection' },
            { to: '/clerk/id-cards', icon: CreditCard, label: 'ID Cards' },
            { to: '/clerk/profile', icon: User, label: 'My Profile' },
        ];
    } else if (role === 'TEACHER') {
        links = [
            { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'My Classes' },
            { to: '/teacher/results', icon: BookOpen, label: 'Upload Results' },
            { to: '/teacher/profile', icon: User, label: 'Profile' },
        ];
    } else if (role === 'STUDENT') {
        links = [
            { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/student/results', icon: GraduationCap, label: 'My Results' },
            { to: '/student/leave', icon: CalendarRange, label: 'Leave Requests' },
            { to: '/student/complaints', icon: MessageSquare, label: 'Helpdesk' },
            { to: '/student/profile', icon: User, label: 'Profile' },
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
