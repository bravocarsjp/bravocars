namespace CarAuction.Domain.Entities;

public class Car
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string? VIN { get; set; }
    public int Mileage { get; set; }
    public string Color { get; set; } = string.Empty;
    public string? Transmission { get; set; }
    public string? FuelType { get; set; }
    public string? Description { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    public Auction? Auction { get; set; }
}
