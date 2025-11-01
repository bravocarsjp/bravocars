using CarAuction.Application.DTOs.Admin;
using CarAuction.Application.DTOs.Auth;
using CarAuction.Application.DTOs.Common;

namespace CarAuction.Application.Interfaces.Services;

public interface IAdminService
{
    Task<ApiResponse<IEnumerable<PendingUserDto>>> GetPendingUsersAsync();
    Task<ApiResponse<IEnumerable<UserDto>>> GetAllUsersAsync(int pageNumber = 1, int pageSize = 20);
    Task<ApiResponse<bool>> ApproveUserAsync(string userId);
    Task<ApiResponse<bool>> RejectUserAsync(string userId, string? rejectionReason = null);
    Task<ApiResponse<bool>> AssignRoleAsync(string userId, string roleName);
    Task<ApiResponse<bool>> RemoveRoleAsync(string userId, string roleName);
}
