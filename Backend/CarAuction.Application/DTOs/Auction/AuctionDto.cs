using CarAuction.Application.DTOs.Car;
using CarAuction.Domain.Enums;

namespace CarAuction.Application.DTOs.Auction;

public class AuctionDto
{
    public int Id { get; set; }
    public int CarId { get; set; }
    public CarDto Car { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal CurrentBid { get; set; }
    public string? HighestBidderId { get; set; }
    public AuctionStatus Status { get; set; }
    public int TotalBids { get; set; }
    public DateTime CreatedAt { get; set; }
}
