using CarAuction.Application.DTOs.Admin;
using CarAuction.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarAuction.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(IAdminService adminService, ILogger<AdminController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    /// <summary>
    /// Get all pending user registrations awaiting approval
    /// </summary>
    /// <returns>List of pending users</returns>
    [HttpGet("users/pending")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetPendingUsers()
    {
        var result = await _adminService.GetPendingUsersAsync();

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get all users with pagination and filtering
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <param name="searchTerm">Search term to filter by name or email</param>
    /// <param name="role">Filter by role (Admin, Seller, Bidder)</param>
    /// <param name="status">Filter by status (Active, Pending, Suspended)</param>
    /// <returns>Paginated list of users</returns>
    [HttpGet("users")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? role = null,
        [FromQuery] string? status = null)
    {
        var result = await _adminService.GetAllUsersAsync(pageNumber, pageSize, searchTerm, role, status);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Update user information
    /// </summary>
    /// <param name="userId">User ID to update</param>
    /// <param name="updateUserDto">Updated user information</param>
    /// <returns>Success or error response</returns>
    [HttpPut("users/{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto updateUserDto)
    {
        var result = await _adminService.UpdateUserAsync(userId, updateUserDto);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Approve a pending user registration
    /// </summary>
    /// <param name="userId">User ID to approve</param>
    /// <returns>Success or error response</returns>
    [HttpPost("users/{userId}/approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ApproveUser(string userId)
    {
        var result = await _adminService.ApproveUserAsync(userId);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Reject a pending user registration
    /// </summary>
    /// <param name="userId">User ID to reject</param>
    /// <param name="rejectionReason">Optional reason for rejection</param>
    /// <returns>Success or error response</returns>
    [HttpPost("users/{userId}/reject")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RejectUser(string userId, [FromBody] string? rejectionReason = null)
    {
        var result = await _adminService.RejectUserAsync(userId, rejectionReason);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Suspend a user account
    /// </summary>
    /// <param name="userId">User ID to suspend</param>
    /// <returns>Success or error response</returns>
    [HttpPost("users/{userId}/suspend")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SuspendUser(string userId)
    {
        var result = await _adminService.SuspendUserAsync(userId);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Activate a suspended user account
    /// </summary>
    /// <param name="userId">User ID to activate</param>
    /// <returns>Success or error response</returns>
    [HttpPost("users/{userId}/activate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ActivateUser(string userId)
    {
        var result = await _adminService.ActivateUserAsync(userId);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Assign a role to a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="roleName">Role name to assign (Admin, User, Bidder)</param>
    /// <returns>Success or error response</returns>
    [HttpPost("users/{userId}/roles/{roleName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AssignRole(string userId, string roleName)
    {
        var result = await _adminService.AssignRoleAsync(userId, roleName);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Remove a role from a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="roleName">Role name to remove</param>
    /// <returns>Success or error response</returns>
    [HttpDelete("users/{userId}/roles/{roleName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveRole(string userId, string roleName)
    {
        var result = await _adminService.RemoveRoleAsync(userId, roleName);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get comprehensive dashboard statistics including users, auctions, bids, revenue, and top performers
    /// </summary>
    /// <returns>Dashboard statistics</returns>
    [HttpGet("dashboard/stats")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetDashboardStats()
    {
        var result = await _adminService.GetDashboardStatsAsync();

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get auction performance report for a specified date range
    /// </summary>
    /// <param name="startDate">Start date (optional, defaults to 1 month ago)</param>
    /// <param name="endDate">End date (optional, defaults to today)</param>
    /// <returns>List of auction performance metrics</returns>
    [HttpGet("reports/auction-performance")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAuctionPerformanceReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var result = await _adminService.GetAuctionPerformanceReportAsync(startDate, endDate);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get user activity report with pagination
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <returns>Paginated user activity report</returns>
    [HttpGet("reports/user-activity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetUserActivityReport(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _adminService.GetUserActivityReportAsync(pageNumber, pageSize);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get revenue report for a specified date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <returns>Daily revenue breakdown</returns>
    [HttpGet("reports/revenue")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetRevenueReport(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        if (startDate == default || endDate == default)
        {
            return BadRequest("Both startDate and endDate are required");
        }

        if (endDate < startDate)
        {
            return BadRequest("End date must be after start date");
        }

        var result = await _adminService.GetRevenueReportAsync(startDate, endDate);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
