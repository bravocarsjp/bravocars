using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Domain.Entities;
using CarAuction.Domain.Enums;
using CarAuction.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CarAuction.Infrastructure.Repositories;

public class AuctionRepository : Repository<Auction>, IAuctionRepository
{
    public AuctionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Auction?> GetAuctionWithCarAsync(int auctionId)
    {
        return await _dbSet
            .Include(a => a.Car)
            .FirstOrDefaultAsync(a => a.Id == auctionId);
    }

    public async Task<IEnumerable<Auction>> GetActiveAuctionsAsync()
    {
        var now = DateTime.UtcNow;
        return await _dbSet
            .Include(a => a.Car)
            .Where(a => a.Status == AuctionStatus.Active && a.EndTime > now)
            .OrderBy(a => a.EndTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Auction>> GetAuctionsByStatusAsync(AuctionStatus status)
    {
        return await _dbSet
            .Include(a => a.Car)
            .Where(a => a.Status == status)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Auction>> GetUpcomingAuctionsAsync()
    {
        var now = DateTime.UtcNow;
        return await _dbSet
            .Include(a => a.Car)
            .Where(a => a.Status == AuctionStatus.Scheduled && a.StartTime > now)
            .OrderBy(a => a.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Auction>> GetEndedAuctionsAsync()
    {
        return await _dbSet
            .Include(a => a.Car)
            .Where(a => a.Status == AuctionStatus.Completed || a.Status == AuctionStatus.Cancelled)
            .OrderByDescending(a => a.EndTime)
            .ToListAsync();
    }

    public async Task<Auction?> GetAuctionByCarIdAsync(int carId)
    {
        return await _dbSet
            .Include(a => a.Car)
            .FirstOrDefaultAsync(a => a.CarId == carId);
    }

    public async Task<bool> HasActiveAuctionForCarAsync(int carId)
    {
        return await _dbSet.AnyAsync(a =>
            a.CarId == carId &&
            (a.Status == AuctionStatus.Active || a.Status == AuctionStatus.Scheduled));
    }
}
