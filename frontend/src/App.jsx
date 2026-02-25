import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/admin',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <AdminDashboard /> },
        ],
    },
    {
        path: '/teacher',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <TeacherDashboard /> },
        ],
    },
    {
        path: '/student',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <StudentDashboard /> },
        ],
    },
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
