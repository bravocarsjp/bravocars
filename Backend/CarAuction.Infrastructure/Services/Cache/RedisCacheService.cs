using System.Text.Json;
using CarAuction.Application.Interfaces.Services;
using StackExchange.Redis;

namespace CarAuction.Infrastructure.Services.Cache;

public class RedisCacheService : ICacheService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _database;

    public RedisCacheService(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _database = redis.GetDatabase();
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var value = await _database.StringGetAsync(key);

        if (!value.HasValue)
            return default;

        return JsonSerializer.Deserialize<T>(value!);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        var serializedValue = JsonSerializer.Serialize(value);
        await _database.StringSetAsync(key, serializedValue, expiration);
    }

    public async Task RemoveAsync(string key)
    {
        await _database.KeyDeleteAsync(key);
    }

    public async Task<bool> ExistsAsync(string key)
    {
        return await _database.KeyExistsAsync(key);
    }

    public async Task<bool> AcquireLockAsync(string key, TimeSpan expiration)
    {
        var lockKey = $"lock:{key}";
        return await _database.StringSetAsync(lockKey, "locked", expiration, When.NotExists);
    }

    public async Task ReleaseLockAsync(string key)
    {
        var lockKey = $"lock:{key}";
        await _database.KeyDeleteAsync(lockKey);
    }
}
