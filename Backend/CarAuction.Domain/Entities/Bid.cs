namespace CarAuction.Domain.Entities;

public class Bid
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime PlacedAt { get; set; } = DateTime.UtcNow;

    // Foreign keys
    public int AuctionId { get; set; }
    public string BidderId { get; set; } = string.Empty;

    // Navigation properties
    public Auction Auction { get; set; } = null!;
    public ApplicationUser Bidder { get; set; } = null!;
}
