using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace CarAuction.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    public ICarRepository Cars { get; }
    public IAuctionRepository Auctions { get; }
    public IBidRepository Bids { get; }

    public UnitOfWork(
        ApplicationDbContext context,
        ICarRepository carRepository,
        IAuctionRepository auctionRepository,
        IBidRepository bidRepository)
    {
        _context = context;
        Cars = carRepository;
        Auctions = auctionRepository;
        Bids = bidRepository;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction == null)
            throw new InvalidOperationException("No active transaction to commit");

        try
        {
            await _context.SaveChangesAsync();
            await _transaction.CommitAsync();
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
