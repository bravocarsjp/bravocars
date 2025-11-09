namespace CarAuction.Application.Interfaces.Services;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
    Task RemoveAsync(string key);
    Task<bool> ExistsAsync(string key);
    Task<bool> AcquireLockAsync(string key, TimeSpan expiration);
    Task ReleaseLockAsync(string key);
}
