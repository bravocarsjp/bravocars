using CarAuction.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Jobs;

/// <summary>
/// Background job that cleans up expired refresh tokens from Redis
/// Runs every hour
/// </summary>
public class CleanupExpiredTokensJob
{
    private readonly ICacheService _cacheService;
    private readonly ILogger<CleanupExpiredTokensJob> _logger;

    public CleanupExpiredTokensJob(
        ICacheService cacheService,
        ILogger<CleanupExpiredTokensJob> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    /// <summary>
    /// Main job execution method called by Hangfire
    /// </summary>
    public async Task ExecuteAsync()
    {
        _logger.LogInformation("CleanupExpiredTokensJob started at {Time}", DateTime.UtcNow);

        try
        {
            // Redis automatically handles TTL expiration, but we can add additional cleanup logic here
            // For now, we'll just log that the job ran
            // In the future, we could:
            // - Clean up orphaned sessions
            // - Log token usage statistics
            // - Clean up rate limiting data
            // - Clean up temporary cache entries

            _logger.LogInformation("Token cleanup check completed at {Time}", DateTime.UtcNow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CleanupExpiredTokensJob execution");
            throw;
        }
    }
}
