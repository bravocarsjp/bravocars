using CarAuction.Domain.Entities;
using CarAuction.Domain.Enums;

namespace CarAuction.Application.Interfaces.Repositories;

public interface IAuctionRepository : IRepository<Auction>
{
    Task<Auction?> GetAuctionWithCarAsync(int auctionId);
    Task<IEnumerable<Auction>> GetActiveAuctionsAsync();
    Task<IEnumerable<Auction>> GetAuctionsByStatusAsync(AuctionStatus status);
    Task<IEnumerable<Auction>> GetUpcomingAuctionsAsync();
    Task<IEnumerable<Auction>> GetEndedAuctionsAsync();
    Task<Auction?> GetAuctionByCarIdAsync(int carId);
    Task<bool> HasActiveAuctionForCarAsync(int carId);
}
