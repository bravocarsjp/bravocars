using CarAuction.Domain.Entities;

namespace CarAuction.Application.Interfaces.Repositories;

public interface ICarRepository : IRepository<Car>
{
    Task<Car?> GetByVINAsync(string vin);
    Task<bool> IsVINUniqueAsync(string vin, int? excludeCarId = null);
    Task<IEnumerable<Car>> GetAvailableCarsAsync();
}
