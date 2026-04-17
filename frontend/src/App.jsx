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
import StudentRoutine from './pages/StudentRoutine';
import StudentFees from './pages/StudentFees';
import StudentRegistration from './pages/StudentRegistration';

// Teacher pages
import TeacherResults from './pages/TeacherResults';
import TeacherRoutine from './pages/TeacherRoutine';
import TeacherClassManagement from './pages/TeacherClassManagement';
import TeacherMarksheet from './pages/TeacherMarksheet';
import TeacherLeave from './pages/TeacherLeave';
import TeacherFeedback from './pages/TeacherFeedback';

// Super Admin pages
import SuperAdminFinances from './pages/SuperAdminFinances';
import SuperAdminExams from './pages/SuperAdminExams';
import SuperAdminCommunications from './pages/SuperAdminCommunications';

// Admin pages
import Academics from './pages/Academics';
import RoutineGeneration from './pages/RoutineGeneration';
import AdminExamRoutine from './pages/AdminExamRoutine';
import AdminDutyChart from './pages/AdminDutyChart';
import AdminCopyAllocation from './pages/AdminCopyAllocation';
import AdminScriptDistribution from './pages/AdminScriptDistribution';
import AdminMarksInspection from './pages/AdminMarksInspection';

// Clerk pages
import Fees from './pages/Fees';
import IDCards from './pages/IDCards';
import IncomeExpenditure from './pages/IncomeExpenditure';
import CharacterCertificate from './pages/CharacterCertificate';
import ClerkLeave from './pages/ClerkLeave';
import ClerkFeedback from './pages/ClerkFeedback';
import ClerkAdmission from './pages/ClerkAdmission';
import ClerkPushNotification from './pages/ClerkPushNotification';
import ClerkPushGallery from './pages/ClerkPushGallery';

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
                    { path: 'finances', element: <SuperAdminFinances /> },
                    { path: 'academics', element: <Academics /> },
                    { path: 'exams', element: <SuperAdminExams /> },
                    { path: 'communications', element: <SuperAdminCommunications /> },
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
                    { path: 'routine', element: <RoutineGeneration /> },
                    { path: 'exam-routine', element: <AdminExamRoutine /> },
                    { path: 'duty-chart', element: <AdminDutyChart /> },
                    { path: 'copy-allocation', element: <AdminCopyAllocation /> },
                    { path: 'script-distribution', element: <AdminScriptDistribution /> },
                    { path: 'marks-inspection', element: <AdminMarksInspection /> },
                    { path: 'push-notification', element: <ClerkPushNotification /> },
                    { path: 'push-gallery', element: <ClerkPushGallery /> },
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
                    { path: 'profile', element: <Profile /> },
                    { path: 'admission', element: <ClerkAdmission /> },
                    { path: 'id-cards', element: <IDCards /> },
                    { path: 'fees', element: <Fees /> },
                    { path: 'ledger', element: <IncomeExpenditure /> },
                    { path: 'push-notification', element: <ClerkPushNotification /> },
                    { path: 'push-gallery', element: <ClerkPushGallery /> },
                    { path: 'certificates', element: <CharacterCertificate /> },
                    { path: 'leave', element: <ClerkLeave /> },
                    { path: 'feedback', element: <ClerkFeedback /> },
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
                    { path: 'routine', element: <TeacherRoutine /> },
                    { path: 'classes', element: <TeacherClassManagement /> },
                    { path: 'marks', element: <TeacherResults /> },
                    { path: 'marksheet', element: <TeacherMarksheet /> },
                    { path: 'leave', element: <TeacherLeave /> },
                    { path: 'feedback', element: <TeacherFeedback /> },
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
                    { path: 'routine', element: <StudentRoutine /> },
                    { path: 'results', element: <StudentResults /> },
                    { path: 'leave', element: <StudentLeave /> },
                    { path: 'fees', element: <StudentFees /> },
                    { path: 'complaints', element: <StudentComplaints /> },
                    { path: 'registration', element: <StudentRegistration /> },
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
