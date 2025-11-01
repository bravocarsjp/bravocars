using CarAuction.Application.DTOs.Bid;
using CarAuction.Application.DTOs.Common;

namespace CarAuction.Application.Interfaces.Services;

public interface IBidService
{
    Task<ApiResponse<BidDto>> PlaceBidAsync(string userId, PlaceBidDto placeBidDto);
    Task<ApiResponse<List<BidDto>>> GetBidsByAuctionIdAsync(int auctionId);
    Task<ApiResponse<List<BidDto>>> GetBidsByUserIdAsync(string userId);
    Task<ApiResponse<BidDto>> GetHighestBidAsync(int auctionId);
}
