using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Jobs;

/// <summary>
/// Background job that checks and updates auction statuses
/// Runs every 30 seconds to:
/// - Start scheduled auctions
/// - End expired auctions
/// - Broadcast countdown updates
/// </summary>
public class AuctionStatusJob
{
    private readonly IAuctionRepository _auctionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuctionHubService _auctionHubService;
    private readonly ILogger<AuctionStatusJob> _logger;

    public AuctionStatusJob(
        IAuctionRepository auctionRepository,
        IUnitOfWork unitOfWork,
        IAuctionHubService auctionHubService,
        ILogger<AuctionStatusJob> logger)
    {
        _auctionRepository = auctionRepository;
        _unitOfWork = unitOfWork;
        _auctionHubService = auctionHubService;
        _logger = logger;
    }

    /// <summary>
    /// Main job execution method called by Hangfire
    /// </summary>
    public async Task ExecuteAsync()
    {
        _logger.LogInformation("AuctionStatusJob started at {Time}", DateTime.UtcNow);

        try
        {
            var now = DateTime.UtcNow;

            // Process scheduled auctions that should start
            await StartScheduledAuctionsAsync(now);

            // Process active auctions that should end
            await EndExpiredAuctionsAsync(now);

            // Broadcast countdown updates for active auctions
            await BroadcastCountdownUpdatesAsync(now);

            _logger.LogInformation("AuctionStatusJob completed successfully at {Time}", DateTime.UtcNow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in AuctionStatusJob execution");
            throw; // Hangfire will retry failed jobs
        }
    }

    /// <summary>
    /// Start all scheduled auctions whose start time has passed
    /// </summary>
    private async Task StartScheduledAuctionsAsync(DateTime now)
    {
        try
        {
            var scheduledAuctions = await _auctionRepository.GetAuctionsByStatusAsync(AuctionStatus.Scheduled);

            var auctionsToStart = scheduledAuctions
                .Where(a => a.StartTime <= now && a.EndTime > now)
                .ToList();

            if (!auctionsToStart.Any())
            {
                _logger.LogDebug("No scheduled auctions to start");
                return;
            }

            foreach (var auction in auctionsToStart)
            {
                try
                {
                    auction.Status = AuctionStatus.Active;
                    auction.UpdatedAt = DateTime.UtcNow;

                    _auctionRepository.Update(auction);

                    _logger.LogInformation(
                        "Started auction {AuctionId} - {CarYear} {CarMake} {CarModel}",
                        auction.Id,
                        auction.Car?.Year,
                        auction.Car?.Make,
                        auction.Car?.Model);

                    // Broadcast auction started event
                    await _auctionHubService.BroadcastAuctionStatusChangedAsync(auction.Id, new
                    {
                        auctionId = auction.Id,
                        status = "Active",
                        message = "Auction has started!",
                        startTime = auction.StartTime,
                        endTime = auction.EndTime
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error starting auction {AuctionId}", auction.Id);
                }
            }

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Started {Count} auctions", auctionsToStart.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in StartScheduledAuctionsAsync");
        }
    }

    /// <summary>
    /// End all active auctions whose end time has passed
    /// </summary>
    private async Task EndExpiredAuctionsAsync(DateTime now)
    {
        try
        {
            var activeAuctions = await _auctionRepository.GetAuctionsByStatusAsync(AuctionStatus.Active);

            var auctionsToEnd = activeAuctions
                .Where(a => a.EndTime <= now)
                .ToList();

            if (!auctionsToEnd.Any())
            {
                _logger.LogDebug("No active auctions to end");
                return;
            }

            foreach (var auction in auctionsToEnd)
            {
                try
                {
                    auction.Status = AuctionStatus.Completed;
                    auction.UpdatedAt = DateTime.UtcNow;

                    _auctionRepository.Update(auction);

                    _logger.LogInformation(
                        "Ended auction {AuctionId} - Winner: {WinnerId}, Final Price: {FinalPrice}",
                        auction.Id,
                        auction.WinnerId ?? "No Winner",
                        auction.CurrentPrice);

                    // Broadcast auction ended event
                    await _auctionHubService.BroadcastAuctionEndedAsync(auction.Id, new
                    {
                        auctionId = auction.Id,
                        status = "Completed",
                        winnerId = auction.WinnerId,
                        finalPrice = auction.CurrentPrice,
                        endTime = auction.EndTime,
                        message = auction.WinnerId != null
                            ? "Auction ended with a winner!"
                            : "Auction ended with no bids"
                    });

                    // TODO: Enqueue job to send winner notification email
                    // BackgroundJob.Enqueue<WinnerNotificationJob>(job => job.ExecuteAsync(auction.Id));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error ending auction {AuctionId}", auction.Id);
                }
            }

            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("Ended {Count} auctions", auctionsToEnd.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in EndExpiredAuctionsAsync");
        }
    }

    /// <summary>
    /// Broadcast countdown updates for all active auctions
    /// </summary>
    private async Task BroadcastCountdownUpdatesAsync(DateTime now)
    {
        try
        {
            var activeAuctions = await _auctionRepository.GetAuctionsByStatusAsync(AuctionStatus.Active);

            if (!activeAuctions.Any())
            {
                _logger.LogDebug("No active auctions for countdown updates");
                return;
            }

            foreach (var auction in activeAuctions)
            {
                try
                {
                    var remainingTime = auction.EndTime - now;
                    var remainingSeconds = (int)remainingTime.TotalSeconds;

                    // Only broadcast if auction hasn't ended
                    if (remainingSeconds > 0)
                    {
                        await _auctionHubService.BroadcastCountdownUpdateAsync(auction.Id, new
                        {
                            auctionId = auction.Id,
                            remainingSeconds = remainingSeconds,
                            remainingMinutes = (int)remainingTime.TotalMinutes,
                            remainingHours = (int)remainingTime.TotalHours,
                            endTime = auction.EndTime,
                            currentPrice = auction.CurrentPrice,
                            totalBids = auction.Bids?.Count ?? 0
                        });

                        _logger.LogDebug(
                            "Broadcast countdown for auction {AuctionId}: {RemainingMinutes} minutes remaining",
                            auction.Id,
                            (int)remainingTime.TotalMinutes);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error broadcasting countdown for auction {AuctionId}", auction.Id);
                }
            }

            _logger.LogDebug("Broadcast countdown updates for {Count} active auctions", activeAuctions.Count());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in BroadcastCountdownUpdatesAsync");
        }
    }
}
