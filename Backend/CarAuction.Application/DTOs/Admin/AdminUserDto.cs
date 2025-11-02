namespace CarAuction.Application.DTOs.Admin;

public class AdminUserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty; // Primary role
    public List<string> Roles { get; set; } = new(); // All roles
    public string Status { get; set; } = string.Empty; // "Pending", "Active", "Suspended"
    public DateTime CreatedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
}
