using CarAuction.Application.DTOs.Admin;
using CarAuction.Application.DTOs.Auth;
using CarAuction.Application.DTOs.Common;

namespace CarAuction.Application.Interfaces.Services;

public interface IAdminService
{
    // User Management
    Task<ApiResponse<IEnumerable<PendingUserDto>>> GetPendingUsersAsync();
    Task<ApiResponse<PaginatedListDto<AdminUserDto>>> GetAllUsersAsync(
        int pageNumber = 1,
        int pageSize = 20,
        string? searchTerm = null,
        string? role = null,
        string? status = null);
    Task<ApiResponse<bool>> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
    Task<ApiResponse<bool>> ApproveUserAsync(string userId);
    Task<ApiResponse<bool>> RejectUserAsync(string userId, string? rejectionReason = null);
    Task<ApiResponse<bool>> SuspendUserAsync(string userId);
    Task<ApiResponse<bool>> ActivateUserAsync(string userId);
    Task<ApiResponse<bool>> AssignRoleAsync(string userId, string roleName);
    Task<ApiResponse<bool>> RemoveRoleAsync(string userId, string roleName);

    // Dashboard & Analytics
    Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync();
    Task<ApiResponse<List<AuctionPerformanceDto>>> GetAuctionPerformanceReportAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<ApiResponse<List<UserActivityDto>>> GetUserActivityReportAsync(int pageNumber = 1, int pageSize = 20);
    Task<ApiResponse<List<RevenueReportDto>>> GetRevenueReportAsync(DateTime startDate, DateTime endDate);
}
