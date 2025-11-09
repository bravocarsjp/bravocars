using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Domain.Entities;
using CarAuction.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CarAuction.Infrastructure.Repositories;

public class BidRepository : Repository<Bid>, IBidRepository
{
    public BidRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Bid>> GetBidsByAuctionIdAsync(int auctionId)
    {
        return await _dbSet
            .Include(b => b.Bidder)
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.PlacedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Bid>> GetBidsByUserIdAsync(string userId)
    {
        return await _dbSet
            .Include(b => b.Auction)
                .ThenInclude(a => a.Car)
            .Where(b => b.BidderId == userId)
            .OrderByDescending(b => b.PlacedAt)
            .ToListAsync();
    }

    public async Task<Bid?> GetHighestBidAsync(int auctionId)
    {
        return await _dbSet
            .Include(b => b.Bidder)
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .FirstOrDefaultAsync();
    }

    public async Task<decimal?> GetHighestBidAmountAsync(int auctionId)
    {
        return await _dbSet
            .Where(b => b.AuctionId == auctionId)
            .MaxAsync(b => (decimal?)b.Amount);
    }

    public async Task<int> GetBidCountByAuctionIdAsync(int auctionId)
    {
        return await _dbSet.CountAsync(b => b.AuctionId == auctionId);
    }

    public async Task<bool> HasUserBidOnAuctionAsync(string userId, int auctionId)
    {
        return await _dbSet.AnyAsync(b => b.BidderId == userId && b.AuctionId == auctionId);
    }
}
