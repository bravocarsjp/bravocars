using CarAuction.Domain.Enums;

namespace CarAuction.Application.DTOs.Auction;

public class UpdateAuctionDto
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public AuctionStatus Status { get; set; }
}
