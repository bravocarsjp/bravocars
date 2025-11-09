using CarAuction.Application.DTOs.Car;
using CarAuction.Domain.Enums;

namespace CarAuction.Application.DTOs.Auction;

public class AuctionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public decimal? CurrentPrice { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public AuctionStatus Status { get; set; }
    public int CarId { get; set; }
    public CarDto? Car { get; set; }
    public string SellerId { get; set; } = string.Empty;
    public string? WinnerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
