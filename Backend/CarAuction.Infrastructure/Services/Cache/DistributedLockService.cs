using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace CarAuction.Infrastructure.Services.Cache;

public class DistributedLockService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<DistributedLockService> _logger;

    public DistributedLockService(
        IConnectionMultiplexer redis,
        ILogger<DistributedLockService> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    /// <summary>
    /// Acquire a distributed lock with retry logic
    /// </summary>
    /// <param name="key">Lock key</param>
    /// <param name="value">Lock token/value</param>
    /// <param name="expiry">Lock expiration time</param>
    /// <param name="retryCount">Number of retry attempts</param>
    /// <param name="retryDelay">Delay between retries</param>
    /// <returns>True if lock was acquired, false otherwise</returns>
    public async Task<bool> AcquireLockAsync(
        string key,
        string value,
        TimeSpan expiry,
        int retryCount = 3,
        TimeSpan? retryDelay = null)
    {
        retryDelay ??= TimeSpan.FromMilliseconds(100);

        var db = _redis.GetDatabase();
        var lockKey = GetLockKey(key);

        for (int i = 0; i < retryCount; i++)
        {
            var acquired = await db.StringSetAsync(lockKey, value, expiry, When.NotExists);

            if (acquired)
            {
                _logger.LogDebug("Lock acquired for key: {LockKey}, token: {Token}", lockKey, value);
                return true;
            }

            if (i < retryCount - 1)
            {
                await Task.Delay(retryDelay.Value);
            }
        }

        _logger.LogWarning("Failed to acquire lock for key: {LockKey} after {RetryCount} attempts", lockKey, retryCount);
        return false;
    }

    /// <summary>
    /// Release a distributed lock
    /// </summary>
    /// <param name="key">Lock key</param>
    /// <param name="value">Lock token/value (must match the value used to acquire the lock)</param>
    /// <returns>True if lock was released, false if lock didn't exist or token didn't match</returns>
    public async Task<bool> ReleaseLockAsync(string key, string value)
    {
        var db = _redis.GetDatabase();
        var lockKey = GetLockKey(key);

        // Lua script to ensure we only delete the lock if the value matches
        // This prevents releasing a lock that was acquired by another process
        const string script = @"
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end
        ";

        var result = await db.ScriptEvaluateAsync(script, new RedisKey[] { lockKey }, new RedisValue[] { value });

        var released = (int)result == 1;

        if (released)
        {
            _logger.LogDebug("Lock released for key: {LockKey}, token: {Token}", lockKey, value);
        }
        else
        {
            _logger.LogWarning("Failed to release lock for key: {LockKey}, token: {Token}", lockKey, value);
        }

        return released;
    }

    /// <summary>
    /// Execute an action within a distributed lock
    /// </summary>
    /// <typeparam name="T">Return type</typeparam>
    /// <param name="key">Lock key</param>
    /// <param name="action">Action to execute</param>
    /// <param name="expiry">Lock expiration time</param>
    /// <param name="retryCount">Number of retry attempts to acquire the lock</param>
    /// <returns>Result of the action, or default if lock couldn't be acquired</returns>
    public async Task<T?> ExecuteWithLockAsync<T>(
        string key,
        Func<Task<T>> action,
        TimeSpan expiry,
        int retryCount = 3)
    {
        var lockToken = Guid.NewGuid().ToString();

        var acquired = await AcquireLockAsync(key, lockToken, expiry, retryCount);

        if (!acquired)
        {
            _logger.LogWarning("Could not acquire lock for key: {LockKey}", key);
            return default;
        }

        try
        {
            return await action();
        }
        finally
        {
            await ReleaseLockAsync(key, lockToken);
        }
    }

    /// <summary>
    /// Execute an action within a distributed lock (no return value)
    /// </summary>
    /// <param name="key">Lock key</param>
    /// <param name="action">Action to execute</param>
    /// <param name="expiry">Lock expiration time</param>
    /// <param name="retryCount">Number of retry attempts to acquire the lock</param>
    /// <returns>True if action was executed successfully, false if lock couldn't be acquired</returns>
    public async Task<bool> ExecuteWithLockAsync(
        string key,
        Func<Task> action,
        TimeSpan expiry,
        int retryCount = 3)
    {
        var lockToken = Guid.NewGuid().ToString();

        var acquired = await AcquireLockAsync(key, lockToken, expiry, retryCount);

        if (!acquired)
        {
            _logger.LogWarning("Could not acquire lock for key: {LockKey}", key);
            return false;
        }

        try
        {
            await action();
            return true;
        }
        finally
        {
            await ReleaseLockAsync(key, lockToken);
        }
    }

    private static string GetLockKey(string key)
    {
        return $"lock:{key}";
    }
}
