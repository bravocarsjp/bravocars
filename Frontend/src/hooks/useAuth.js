import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  usePostApiAuthLogin,
  usePostApiAuthRegister,
  usePostApiAuthLogout,
  useGetApiAuthMe,
} from '../api/generated/auth/auth';
import useAuthStore from '../stores/authStore';

/**
 * Custom hook for authentication that uses React Query hooks
 * and manages auth state with Zustand
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser, clearUser } = useAuthStore();

  // Login mutation
  const loginMutation = usePostApiAuthLogin({
    mutation: {
      onSuccess: (response) => {
        if (response?.success) {
          const { token, refreshToken, user } = response.data;
          localStorage.setItem('accessToken', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        }
      },
    },
  });

  // Register mutation
  const registerMutation = usePostApiAuthRegister();

  // Logout mutation
  const logoutMutation = usePostApiAuthLogout({
    mutation: {
      onSettled: () => {
        // Clear auth data regardless of success/failure
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        clearUser();
        navigate('/login');
      },
    },
  });

  // Get current user query
  const { data: currentUser, refetch: refetchUser } = useGetApiAuthMe({
    query: {
      enabled: !!localStorage.getItem('accessToken'),
      retry: false,
    },
  });

  // Login wrapper
  const login = useCallback(
    async (credentials) => {
      try {
        const response = await loginMutation.mutateAsync({ data: credentials });
        return { success: true, data: response };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.errors?.Email?.[0] ||
          error.response?.data?.errors?.Password?.[0] ||
          'Login failed. Please check your credentials.';
        return { success: false, message: errorMessage };
      }
    },
    [loginMutation]
  );

  // Register wrapper
  const register = useCallback(
    async (userData) => {
      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('1. Attempting to register with data:', userData);
      try {
        console.log('2. Calling registerMutation.mutateAsync...');
        const response = await registerMutation.mutateAsync({ data: userData });
        console.log('3. ✅ Registration API call succeeded!');
        console.log('4. Response:', response);
        console.log('5. Response.success:', response?.success);
        console.log('6. Response.message:', response?.message);

        // Check if response has success property
        if (response && response.success) {
          console.log('7. ✅ SUCCESS - Registration completed successfully!');
          return { success: true, data: response };
        } else {
          console.log('7. ❌ UNEXPECTED - Got 200 response but success is not true');
          console.log('   Full response:', JSON.stringify(response, null, 2));
          return { success: false, message: 'Unexpected response from server' };
        }
      } catch (error) {
        console.error('=== REGISTRATION ERROR ===');
        console.error('Error:', error);
        console.error('Error response:', error.response);
        console.error('Error data:', error.response?.data);

        // Extract error message from various possible locations
        let errorMessage = 'Registration failed. Please try again.';

        if (error.response?.data) {
          const data = error.response.data;

          // Check for standard API response format
          if (data.message) {
            errorMessage = data.message;
          }
          // Check for validation errors
          else if (data.errors) {
            // Get first validation error
            const firstError = Object.values(data.errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          }
          // Check if data itself is a string message
          else if (typeof data === 'string') {
            errorMessage = data;
          }
        }

        return { success: false, message: errorMessage };
      }
    },
    [registerMutation]
  );

  // Logout wrapper
  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return {
    // State
    user,
    isAuthenticated: !!user, // Derived from user state for convenience

    // Mutations
    login,
    register,
    logout,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Current user query
    currentUser,
    refetchUser,
  };
};

export default useAuth;
