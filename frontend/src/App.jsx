import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Dashboards
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ClerkDashboard from './pages/ClerkDashboard';

// Shared pages
import Profile from './pages/Profile';
import Users from './pages/Users';

// Student pages
import StudentLeave from './pages/StudentLeave';
import StudentComplaints from './pages/StudentComplaints';
import StudentResults from './pages/StudentResults';

// Teacher pages
import TeacherResults from './pages/TeacherResults';

// Admin pages
import Academics from './pages/Academics';

// Clerk pages
import Fees from './pages/Fees';
import IDCards from './pages/IDCards';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },

    // ── Super Admin ─────────────────────────────────
    {
        path: '/superadmin',
        element: <ProtectedRoute allowedRoles={['SUPERADMIN']} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <SuperAdminDashboard /> },
                    { path: 'users', element: <Users /> },
                    { path: 'settings', element: <div className="text-gray-500 text-center py-20 text-lg">System Settings — coming soon</div> },
                    { path: 'profile', element: <Profile /> },
                ],
            },
        ],
    },

    // ── Admin ───────────────────────────────────────
    {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <AdminDashboard /> },
                    { path: 'academics', element: <Academics /> },
                    { path: 'users', element: <Users /> },
                    { path: 'profile', element: <Profile /> },
                ],
            },
        ],
    },

    // ── Clerk ───────────────────────────────────────
    {
        path: '/clerk',
        element: <ProtectedRoute allowedRoles={['CLERK']} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <ClerkDashboard /> },
                    { path: 'fees', element: <Fees /> },
                    { path: 'id-cards', element: <IDCards /> },
                    { path: 'profile', element: <Profile /> },
                ],
            },
        ],
    },

    // ── Teacher ─────────────────────────────────────
    {
        path: '/teacher',
        element: <ProtectedRoute allowedRoles={['TEACHER']} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <TeacherDashboard /> },
                    { path: 'results', element: <TeacherResults /> },
                    { path: 'profile', element: <Profile /> },
                ],
            },
        ],
    },

    // ── Student ─────────────────────────────────────
    {
        path: '/student',
        element: <ProtectedRoute allowedRoles={['STUDENT']} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <StudentDashboard /> },
                    { path: 'results', element: <StudentResults /> },
                    { path: 'leave', element: <StudentLeave /> },
                    { path: 'complaints', element: <StudentComplaints /> },
                    { path: 'profile', element: <Profile /> },
                ],
            },
        ],
    },

    // ── 404 ─────────────────────────────────────────
    {
        path: '*',
        element: (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
                    <p>Page Not Found</p>
                </div>
            </div>
        ),
    },
]);
