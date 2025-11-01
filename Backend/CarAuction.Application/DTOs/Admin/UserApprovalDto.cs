namespace CarAuction.Application.DTOs.Admin;

public class UserApprovalDto
{
    public string UserId { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public string? RejectionReason { get; set; }
}
