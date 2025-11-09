import { create } from 'zustand';

/**
 * Simplified auth store that only manages auth state
 * API calls are now handled by React Query hooks in useAuth
 */
const useAuthStore = create((set, get) => ({
  // Get initial user from localStorage
  user: (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  })(),

  // Derived state - computed in components
  // isAuthenticated should be derived from user state in components like: !!user

  // Set user (called after successful login)
  setUser: (user) => set({ user }),

  // Clear user (called after logout)
  clearUser: () => set({ user: null }),

  // Update user (for profile updates)
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
}));

export default useAuthStore;
