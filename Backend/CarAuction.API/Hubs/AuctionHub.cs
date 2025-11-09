using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace CarAuction.API.Hubs;

[Authorize]
public class AuctionHub : Hub
{
    private readonly ILogger<AuctionHub> _logger;

    public AuctionHub(ILogger<AuctionHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = Context.User?.FindFirstValue(ClaimTypes.Name) ?? "Anonymous";

        _logger.LogInformation("User {UserName} ({UserId}) connected to AuctionHub. ConnectionId: {ConnectionId}",
            userName, userId, Context.ConnectionId);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = Context.User?.FindFirstValue(ClaimTypes.Name) ?? "Anonymous";

        _logger.LogInformation("User {UserName} ({UserId}) disconnected from AuctionHub. ConnectionId: {ConnectionId}",
            userName, userId, Context.ConnectionId);

        if (exception != null)
        {
            _logger.LogError(exception, "Error during disconnection for user {UserId}", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Join a specific auction room to receive real-time updates
    /// </summary>
    /// <param name="auctionId">The ID of the auction to join</param>
    public async Task JoinAuction(int auctionId)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = Context.User?.FindFirstValue(ClaimTypes.Name) ?? "Anonymous";

        var groupName = GetAuctionGroupName(auctionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        _logger.LogInformation("User {UserName} ({UserId}) joined auction {AuctionId}",
            userName, userId, auctionId);

        // Notify the user they've successfully joined
        await Clients.Caller.SendAsync("JoinedAuction", auctionId);
    }

    /// <summary>
    /// Leave a specific auction room
    /// </summary>
    /// <param name="auctionId">The ID of the auction to leave</param>
    public async Task LeaveAuction(int auctionId)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = Context.User?.FindFirstValue(ClaimTypes.Name) ?? "Anonymous";

        var groupName = GetAuctionGroupName(auctionId);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        _logger.LogInformation("User {UserName} ({UserId}) left auction {AuctionId}",
            userName, userId, auctionId);

        // Notify the user they've successfully left
        await Clients.Caller.SendAsync("LeftAuction", auctionId);
    }

    /// <summary>
    /// Get the SignalR group name for a specific auction
    /// </summary>
    private static string GetAuctionGroupName(int auctionId)
    {
        return $"auction_{auctionId}";
    }

    // Server-side methods to broadcast updates (called from services, not clients)

    /// <summary>
    /// Broadcast a new bid to all users watching the auction
    /// </summary>
    public static async Task SendBidUpdate(
        IHubContext<AuctionHub> hubContext,
        int auctionId,
        object bidInfo)
    {
        var groupName = GetAuctionGroupName(auctionId);
        await hubContext.Clients.Group(groupName).SendAsync("BidPlaced", bidInfo);
    }

    /// <summary>
    /// Broadcast auction status change to all watchers
    /// </summary>
    public static async Task SendAuctionStatusUpdate(
        IHubContext<AuctionHub> hubContext,
        int auctionId,
        object statusInfo)
    {
        var groupName = GetAuctionGroupName(auctionId);
        await hubContext.Clients.Group(groupName).SendAsync("AuctionStatusChanged", statusInfo);
    }

    /// <summary>
    /// Broadcast countdown update to all watchers
    /// </summary>
    public static async Task SendCountdownUpdate(
        IHubContext<AuctionHub> hubContext,
        int auctionId,
        object countdownInfo)
    {
        var groupName = GetAuctionGroupName(auctionId);
        await hubContext.Clients.Group(groupName).SendAsync("CountdownUpdate", countdownInfo);
    }

    /// <summary>
    /// Broadcast auction ended event to all watchers
    /// </summary>
    public static async Task SendAuctionEnded(
        IHubContext<AuctionHub> hubContext,
        int auctionId,
        object auctionEndInfo)
    {
        var groupName = GetAuctionGroupName(auctionId);
        await hubContext.Clients.Group(groupName).SendAsync("AuctionEnded", auctionEndInfo);
    }
}
