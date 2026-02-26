import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import IDCards from './pages/IDCards.jsx'
import Academics from './pages/Academics.jsx'
import Users from './pages/Users.jsx'
import TeacherResults from './pages/TeacherResults.jsx'
import StudentResults from './pages/StudentResults.jsx'
import Profile from './pages/Profile.jsx'
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx'
import ClerkDashboard from './pages/ClerkDashboard.jsx'
import Fees from './pages/Fees.jsx'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        loader: () => redirect('/login'),
    },
    {
        path: '/admin',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <AdminDashboard /> },
            { path: 'id-cards', element: <IDCards /> },
            { path: 'academics', element: <Academics /> },
            { path: 'users', element: <Users /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
    {
        path: '/superadmin',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <SuperAdminDashboard /> },
            { path: 'users', element: <Users /> },
            { path: 'settings', element: <div className="p-8"><h1 className="text-2xl font-bold">System Settings</h1><p className="text-gray-500 mt-2">Coming soon...</p></div> },
            { path: 'profile', element: <Profile /> },
        ],
    },
    {
        path: '/clerk',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <ClerkDashboard /> },
            { path: 'id-cards', element: <IDCards /> },
            { path: 'fees', element: <Fees /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
    {
        path: '/teacher',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <TeacherDashboard /> },
            { path: 'results', element: <TeacherResults /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
    {
        path: '/student',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <StudentDashboard /> },
            { path: 'results', element: <StudentResults /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)
