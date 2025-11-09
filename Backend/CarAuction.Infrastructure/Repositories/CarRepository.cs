using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Domain.Entities;
using CarAuction.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CarAuction.Infrastructure.Repositories;

public class CarRepository : Repository<Car>, ICarRepository
{
    public CarRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Car?> GetByVINAsync(string vin)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.VIN == vin);
    }

    public async Task<bool> IsVINUniqueAsync(string vin, int? excludeCarId = null)
    {
        if (excludeCarId.HasValue)
            return !await _dbSet.AnyAsync(c => c.VIN == vin && c.Id != excludeCarId.Value);

        return !await _dbSet.AnyAsync(c => c.VIN == vin);
    }

    public async Task<IEnumerable<Car>> GetAvailableCarsAsync()
    {
        return await _dbSet
            .Where(c => !_context.Auctions.Any(a => a.CarId == c.Id))
            .ToListAsync();
    }
}
