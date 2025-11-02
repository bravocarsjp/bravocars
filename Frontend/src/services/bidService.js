import api from '../config/api';

const bidService = {
  /**
   * Place a bid on an auction
   * @param {number} auctionId - The auction ID
   * @param {number} amount - The bid amount
   * @returns {Promise<Object>} The API response
   */
  async placeBid(auctionId, amount) {
    try {
      const response = await api.post('/bids', {
        auctionId,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('Error placing bid:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to place bid',
      };
    }
  },

  /**
   * Get all bids for a specific auction
   * @param {number} auctionId - The auction ID
   * @returns {Promise<Object>} The API response with bids
   */
  async getBidsByAuctionId(auctionId) {
    try {
      const response = await api.get(`/bids/auction/${auctionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bids:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bids',
        data: [],
      };
    }
  },

  /**
   * Get all bids placed by the current user
   * @returns {Promise<Object>} The API response with user's bids
   */
  async getMyBids() {
    try {
      const response = await api.get('/bids/my-bids');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bids:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch your bids',
        data: [],
      };
    }
  },

  /**
   * Get the highest bid for a specific auction
   * @param {number} auctionId - The auction ID
   * @returns {Promise<Object>} The API response with the highest bid
   */
  async getHighestBid(auctionId) {
    try {
      const response = await api.get(`/bids/auction/${auctionId}/highest`);
      return response.data;
    } catch (error) {
      console.error('Error fetching highest bid:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch highest bid',
        data: null,
      };
    }
  },
};

export default bidService;
