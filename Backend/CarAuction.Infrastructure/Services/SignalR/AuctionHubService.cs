using CarAuction.Application.Interfaces.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Services.SignalR;

public class AuctionHubService : IAuctionHubService
{
    private readonly IHubContext<Hub>? _hubContext;
    private readonly ILogger<AuctionHubService> _logger;

    public AuctionHubService(
        ILogger<AuctionHubService> logger,
        IHubContext<Hub>? hubContext = null)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task BroadcastBidPlacedAsync(int auctionId, object bidInfo)
    {
        if (_hubContext == null) return;

        try
        {
            var groupName = $"auction_{auctionId}";
            await _hubContext.Clients.Group(groupName).SendAsync("BidPlaced", bidInfo);
            _logger.LogDebug("Broadcast bid placed for auction {AuctionId}", auctionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting bid placed for auction {AuctionId}", auctionId);
        }
    }

    public async Task BroadcastAuctionStatusChangedAsync(int auctionId, object statusInfo)
    {
        if (_hubContext == null) return;

        try
        {
            var groupName = $"auction_{auctionId}";
            await _hubContext.Clients.Group(groupName).SendAsync("AuctionStatusChanged", statusInfo);
            _logger.LogDebug("Broadcast status changed for auction {AuctionId}", auctionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting status change for auction {AuctionId}", auctionId);
        }
    }

    public async Task BroadcastCountdownUpdateAsync(int auctionId, object countdownInfo)
    {
        if (_hubContext == null) return;

        try
        {
            var groupName = $"auction_{auctionId}";
            await _hubContext.Clients.Group(groupName).SendAsync("CountdownUpdate", countdownInfo);
            _logger.LogDebug("Broadcast countdown update for auction {AuctionId}", auctionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting countdown for auction {AuctionId}", auctionId);
        }
    }

    public async Task BroadcastAuctionEndedAsync(int auctionId, object auctionEndInfo)
    {
        if (_hubContext == null) return;

        try
        {
            var groupName = $"auction_{auctionId}";
            await _hubContext.Clients.Group(groupName).SendAsync("AuctionEnded", auctionEndInfo);
            _logger.LogDebug("Broadcast auction ended for auction {AuctionId}", auctionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting auction ended for auction {AuctionId}", auctionId);
        }
    }
}
