import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * ProtectedRoute — wraps route groups that require authentication + role check.
 *
 * @param {string[]} allowedRoles  — roles permitted to access the child routes.
 *                                    If omitted, any authenticated user is allowed.
 */
export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, role } = useAuthStore();

    // 1. Not logged in → send to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Logged in but wrong role → show unauthorized
    if (allowedRoles && !allowedRoles.includes(role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h1 className="text-5xl font-extrabold text-red-500 mb-3">403</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <a
                        href="/login"
                        className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        );
    }

    // 3. Authorised → render children
    return <Outlet />;
}
