namespace CarAuction.Application.DTOs.Admin;

public class DashboardStatsDto
{
    // User Statistics
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int PendingUsers { get; set; }
    public int NewUsersToday { get; set; }
    public int NewUsersThisWeek { get; set; }
    public int NewUsersThisMonth { get; set; }

    // Auction Statistics
    public int TotalAuctions { get; set; }
    public int ActiveAuctions { get; set; }
    public int ScheduledAuctions { get; set; }
    public int CompletedAuctions { get; set; }
    public int CancelledAuctions { get; set; }

    // Bidding Statistics
    public int TotalBids { get; set; }
    public int BidsToday { get; set; }
    public int BidsThisWeek { get; set; }
    public int BidsThisMonth { get; set; }
    public decimal AverageBidsPerAuction { get; set; }

    // Revenue Statistics
    public decimal TotalRevenueAllTime { get; set; }
    public decimal RevenueToday { get; set; }
    public decimal RevenueThisWeek { get; set; }
    public decimal RevenueThisMonth { get; set; }
    public decimal AverageAuctionValue { get; set; }
    public decimal HighestBidValue { get; set; }

    // Car Statistics
    public int TotalCars { get; set; }
    public int CarsWithActiveAuctions { get; set; }
    public int CarsWithCompletedAuctions { get; set; }

    // Performance Metrics
    public double AuctionCompletionRate { get; set; } // Percentage of auctions that get bids
    public double AverageTimeToFirstBid { get; set; } // In hours
    public int MostActiveHour { get; set; } // Hour of day with most bids (0-23)

    // Top Performers
    public List<TopBidderDto> TopBidders { get; set; } = new();
    public List<TopAuctionDto> TopAuctions { get; set; } = new();
}

public class TopBidderDto
{
    public string UserId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int TotalBids { get; set; }
    public decimal TotalBidAmount { get; set; }
    public int AuctionsWon { get; set; }
}

public class TopAuctionDto
{
    public int AuctionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CarDetails { get; set; } = string.Empty;
    public decimal FinalPrice { get; set; }
    public int TotalBids { get; set; }
    public DateTime EndTime { get; set; }
}

public class AuctionPerformanceDto
{
    public int AuctionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CarDetails { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public int TotalBids { get; set; }
    public int UniqueBidders { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public TimeSpan TimeToFirstBid { get; set; }
    public decimal PriceIncrease { get; set; }
    public double PriceIncreasePercentage { get; set; }
}

public class UserActivityDto
{
    public string UserId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public int TotalBidsPlaced { get; set; }
    public int AuctionsWon { get; set; }
    public decimal TotalAmountBid { get; set; }
    public decimal TotalAmountWon { get; set; }
    public bool IsActive { get; set; }
}

public class RevenueReportDto
{
    public DateTime Date { get; set; }
    public int AuctionsCompleted { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalBids { get; set; }
    public decimal AverageAuctionValue { get; set; }
}
