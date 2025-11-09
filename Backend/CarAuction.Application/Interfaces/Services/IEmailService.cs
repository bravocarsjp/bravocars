namespace CarAuction.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendRegistrationEmailAsync(string email, string firstName);
    Task SendApprovalEmailAsync(string email, string firstName);
    Task SendRejectionEmailAsync(string email, string firstName);
    Task SendAuctionStartNotificationAsync(string email, string firstName, int auctionId, string carName);
    Task SendAuctionEndNotificationAsync(string email, string firstName, int auctionId, string carName);
    Task SendBidPlacedNotificationAsync(string email, string firstName, int auctionId, string carName, decimal amount);
    Task SendOutbidNotificationAsync(string email, string firstName, int auctionId, string carName, decimal newHighestBid);
    Task SendWinnerNotificationAsync(string email, string firstName, int auctionId, string carName, decimal winningBid);
}
