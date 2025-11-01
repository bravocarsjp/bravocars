import apiClient from '../config/api';

const auctionService = {
  // Get all auctions with pagination and filters
  getAuctions: async (params = {}) => {
    const { pageNumber = 1, pageSize = 20, status } = params;
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(status && { status }),
    });
    
    const response = await apiClient.get(`/auctions?${queryParams}`);
    return response.data;
  },

  // Get auction by ID
  getAuctionById: async (id) => {
    const response = await apiClient.get(`/auctions/${id}`);
    return response.data;
  },

  // Create new auction (Admin only)
  createAuction: async (auctionData) => {
    const response = await apiClient.post('/auctions', auctionData);
    return response.data;
  },

  // Update auction (Admin only)
  updateAuction: async (id, auctionData) => {
    const response = await apiClient.put(`/auctions/${id}`, auctionData);
    return response.data;
  },

  // Delete auction (Admin only)
  deleteAuction: async (id) => {
    const response = await apiClient.delete(`/auctions/${id}`);
    return response.data;
  },
};

export default auctionService;
