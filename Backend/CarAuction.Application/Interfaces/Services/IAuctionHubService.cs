namespace CarAuction.Application.Interfaces.Services;

public interface IAuctionHubService
{
    Task BroadcastBidPlacedAsync(int auctionId, object bidInfo);
    Task BroadcastAuctionStatusChangedAsync(int auctionId, object statusInfo);
    Task BroadcastCountdownUpdateAsync(int auctionId, object countdownInfo);
    Task BroadcastAuctionEndedAsync(int auctionId, object auctionEndInfo);
}
