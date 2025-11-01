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
    /// Get all users with pagination
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <returns>Paginated list of users</returns>
    [HttpGet("users")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAllUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _adminService.GetAllUsersAsync(pageNumber, pageSize);

        if (!result.Success)
        {
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
}
