namespace CarAuction.Application.DTOs.Auction;

public class CreateAuctionDto
{
    public int CarId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}
