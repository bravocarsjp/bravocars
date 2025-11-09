namespace CarAuction.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    ICarRepository Cars { get; }
    IAuctionRepository Auctions { get; }
    IBidRepository Bids { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
