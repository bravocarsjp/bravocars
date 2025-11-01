using CarAuction.Application.DTOs.Auction;
using CarAuction.Application.DTOs.Common;
using CarAuction.Domain.Enums;

namespace CarAuction.Application.Interfaces.Services;

public interface IAuctionService
{
    Task<ApiResponse<PaginatedResult<AuctionDto>>> GetAllAuctionsAsync(int pageNumber, int pageSize, AuctionStatus? status = null);
    Task<ApiResponse<AuctionDto>> GetAuctionByIdAsync(int id);
    Task<ApiResponse<AuctionDto>> CreateAuctionAsync(CreateAuctionDto createAuctionDto);
    Task<ApiResponse<AuctionDto>> UpdateAuctionAsync(UpdateAuctionDto updateAuctionDto);
    Task<ApiResponse<bool>> UpdateAuctionStatusAsync(int id, AuctionStatus status);
    Task<ApiResponse<bool>> DeleteAuctionAsync(int id);
}
