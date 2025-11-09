using System.Net;
using System.Net.Mail;
using CarAuction.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Services.Email;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        _smtpHost = configuration["Email:SmtpHost"] ?? "localhost";
        _smtpPort = int.Parse(configuration["Email:SmtpPort"] ?? "587");
        _smtpUsername = configuration["Email:SmtpUsername"] ?? "";
        _smtpPassword = configuration["Email:SmtpPassword"] ?? "";
        _fromEmail = configuration["Email:FromEmail"] ?? "noreply@bravocars.com";
        _fromName = configuration["Email:FromName"] ?? "BRAVOCARS";
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            using var message = new MailMessage();
            message.From = new MailAddress(_fromEmail, _fromName);
            message.To.Add(new MailAddress(to));
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            using var smtpClient = new SmtpClient(_smtpHost, _smtpPort);
            smtpClient.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
            smtpClient.EnableSsl = true;

            await smtpClient.SendMailAsync(message);

            _logger.LogInformation("Email sent successfully to {To} with subject: {Subject}", to, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To} with subject: {Subject}", to, subject);
            throw;
        }
    }

    public async Task SendRegistrationEmailAsync(string email, string firstName)
    {
        var subject = "Welcome to BRAVOCARS!";
        var body = $@"
            <h2>Welcome to BRAVOCARS, {firstName}!</h2>
            <p>Thank you for registering with BRAVOCARS. Your account is currently pending approval.</p>
            <p>You will receive an email notification once your account has been approved by our admin team.</p>
            <p>Best regards,<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendApprovalEmailAsync(string email, string firstName)
    {
        var subject = "Your BRAVOCARS Account Has Been Approved!";
        var body = $@"
            <h2>Congratulations, {firstName}!</h2>
            <p>Your BRAVOCARS account has been approved. You can now log in and start bidding on auctions.</p>
            <p>Happy bidding!<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendRejectionEmailAsync(string email, string firstName)
    {
        var subject = "BRAVOCARS Account Registration Update";
        var body = $@"
            <h2>Hello, {firstName}</h2>
            <p>We regret to inform you that your BRAVOCARS account registration could not be approved at this time.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendAuctionStartNotificationAsync(string email, string firstName, int auctionId, string carName)
    {
        var subject = $"Auction Started: {carName}";
        var body = $@"
            <h2>Hello, {firstName}!</h2>
            <p>The auction for <strong>{carName}</strong> has just started!</p>
            <p>Auction ID: {auctionId}</p>
            <p>Don't miss your chance to bid!</p>
            <p>Best regards,<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendAuctionEndNotificationAsync(string email, string firstName, int auctionId, string carName)
    {
        var subject = $"Auction Ended: {carName}";
        var body = $@"
            <h2>Hello, {firstName}!</h2>
            <p>The auction for <strong>{carName}</strong> has ended.</p>
            <p>Auction ID: {auctionId}</p>
            <p>Check the results to see if you won!</p>
            <p>Best regards,<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendBidPlacedNotificationAsync(string email, string firstName, int auctionId, string carName, decimal amount)
    {
        var subject = "Bid Placed Successfully";
        var body = $@"
            <h2>Hello, {firstName}!</h2>
            <p>Your bid of <strong>${amount:N2}</strong> has been placed successfully on <strong>{carName}</strong>.</p>
            <p>Auction ID: {auctionId}</p>
            <p>You will be notified if someone outbids you.</p>
            <p>Best regards,<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendOutbidNotificationAsync(string email, string firstName, int auctionId, string carName, decimal newHighestBid)
    {
        var subject = $"You've Been Outbid: {carName}";
        var body = $@"
            <h2>Hello, {firstName}!</h2>
            <p>Unfortunately, you've been outbid on <strong>{carName}</strong>.</p>
            <p>Current highest bid: <strong>${newHighestBid:N2}</strong></p>
            <p>Auction ID: {auctionId}</p>
            <p>Place a higher bid to get back in the lead!</p>
            <p>Best regards,<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendWinnerNotificationAsync(string email, string firstName, int auctionId, string carName, decimal winningBid)
    {
        var subject = $"Congratulations! You Won: {carName}";
        var body = $@"
            <h2>Congratulations, {firstName}!</h2>
            <p>You are the winning bidder for <strong>{carName}</strong>!</p>
            <p>Your winning bid: <strong>${winningBid:N2}</strong></p>
            <p>Auction ID: {auctionId}</p>
            <p>Our team will contact you soon with next steps.</p>
            <p>Best regards,<br/>BRAVOCARS Team</p>
        ";

        await SendEmailAsync(email, subject, body);
    }
}
