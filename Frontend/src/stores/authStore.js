import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        set({
          user: result.data.user,
          isAuthenticated: true,
          loading: false,
        });
        return { success: true };
      } else {
        set({ error: result.message, loading: false });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Register action
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register(userData);
      set({ loading: false });
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, loading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Update user
  setUser: (user) => set({ user, isAuthenticated: true }),
}));

export default useAuthStore;
