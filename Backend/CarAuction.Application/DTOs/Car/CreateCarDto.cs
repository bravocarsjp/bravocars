namespace CarAuction.Application.DTOs.Car;

public class CreateCarDto
{
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string VIN { get; set; } = string.Empty;
    public int Mileage { get; set; }
    public string Color { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal StartingPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}
