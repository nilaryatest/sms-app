import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('username', email); // OAuth2 expects 'username'
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token, role } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('role', role);

            set({
                token: access_token,
                role,
                isAuthenticated: true,
                isLoading: false
            });

            // Fetch user profile right after login
            await useAuthStore.getState().fetchUser();

            return true;
        } catch (error) {
            set({
                error: error.response?.data?.detail || 'Login failed',
                isLoading: false
            });
            return false;
        }
    },

    fetchUser: async () => {
        try {
            const response = await api.get('/users/me');
            set({ user: response.data });
        } catch (error) {
            console.error("Failed to fetch user", error);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        set({ user: null, token: null, role: null, isAuthenticated: false });
    }
}));

export default useAuthStore;
