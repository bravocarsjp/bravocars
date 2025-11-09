import apiClient from '../config/api';

const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await apiClient.get('/Admin/dashboard/stats');
    return response.data;
  },

  // Get all users (Admin only)
  getUsers: async (params = {}) => {
    const { pageNumber = 1, pageSize = 20, searchTerm, role, status } = params;
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) queryParams.append('searchTerm', searchTerm);
    if (role) queryParams.append('role', role);
    if (status) queryParams.append('status', status);

    const response = await apiClient.get(`/Admin/users?${queryParams}`);
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/Admin/users/${userId}`, userData);
    return response.data;
  },

  // Approve user (Admin only)
  approveUser: async (userId) => {
    const response = await apiClient.post(`/Admin/users/${userId}/approve`);
    return response.data;
  },

  // Suspend user (Admin only)
  suspendUser: async (userId) => {
    const response = await apiClient.post(`/Admin/users/${userId}/suspend`);
    return response.data;
  },

  // Activate user (Admin only)
  activateUser: async (userId) => {
    const response = await apiClient.post(`/Admin/users/${userId}/activate`);
    return response.data;
  },

  // Assign role to user (Admin only)
  assignRole: async (userId, roleName) => {
    const response = await apiClient.post(`/Admin/users/${userId}/roles/${roleName}`);
    return response.data;
  },

  // Remove role from user (Admin only)
  removeRole: async (userId, roleName) => {
    const response = await apiClient.delete(`/Admin/users/${userId}/roles/${roleName}`);
    return response.data;
  },
};

export default adminService;
