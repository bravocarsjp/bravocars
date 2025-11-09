using CarAuction.Application.DTOs.Auth;

namespace CarAuction.Application.DTOs.Bid;

public class BidDto
{
    public int Id { get; set; }
    public int AuctionId { get; set; }
    public string BidderId { get; set; } = string.Empty;
    public UserDto Bidder { get; set; } = null!;
    public decimal Amount { get; set; }
    public DateTime PlacedAt { get; set; }
}
