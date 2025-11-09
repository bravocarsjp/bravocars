using CarAuction.Domain.Entities;

namespace CarAuction.Application.Interfaces.Repositories;

public interface IBidRepository : IRepository<Bid>
{
    Task<IEnumerable<Bid>> GetBidsByAuctionIdAsync(int auctionId);
    Task<IEnumerable<Bid>> GetBidsByUserIdAsync(string userId);
    Task<Bid?> GetHighestBidAsync(int auctionId);
    Task<decimal?> GetHighestBidAmountAsync(int auctionId);
    Task<int> GetBidCountByAuctionIdAsync(int auctionId);
    Task<bool> HasUserBidOnAuctionAsync(string userId, int auctionId);
}
