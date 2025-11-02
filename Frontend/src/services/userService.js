import apiClient from '../config/api';

const userService = {
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/Auth/profile', profileData);

    // Update localStorage with new user data
    if (response.data.success && response.data.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/Auth/password', passwordData);
    return response.data;
  },
};

export default userService;
