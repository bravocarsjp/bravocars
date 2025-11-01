using CarAuction.Domain.Enums;

namespace CarAuction.Domain.Entities;

public class Auction
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public decimal? CurrentPrice { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public AuctionStatus Status { get; set; } = AuctionStatus.Draft;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Foreign keys
    public int CarId { get; set; }
    public string SellerId { get; set; } = string.Empty;
    public string? WinnerId { get; set; }

    // Navigation properties
    public Car Car { get; set; } = null!;
    public ApplicationUser Seller { get; set; } = null!;
    public ApplicationUser? Winner { get; set; }
    public ICollection<Bid> Bids { get; set; } = new List<Bid>();
}
