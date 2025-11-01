using CarAuction.Application.DTOs.Admin;
using CarAuction.Application.DTOs.Auth;
using CarAuction.Application.DTOs.Common;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Services.Admin;

public class AdminService : IAdminService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IEmailService _emailService;
    private readonly ILogger<AdminService> _logger;

    public AdminService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IEmailService emailService,
        ILogger<AdminService> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<PendingUserDto>>> GetPendingUsersAsync()
    {
        try
        {
            var pendingUsers = await _userManager.Users
                .Where(u => !u.IsApproved)
                .Select(u => new PendingUserDto
                {
                    Id = u.Id,
                    Email = u.Email!,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    PhoneNumber = u.PhoneNumber,
                    RegisteredAt = DateTime.UtcNow // TODO: Add CreatedAt field to ApplicationUser
                })
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} pending users", pendingUsers.Count);

            return ApiResponse<IEnumerable<PendingUserDto>>.SuccessResponse(pendingUsers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pending users");
            return ApiResponse<IEnumerable<PendingUserDto>>.ErrorResponse(
                "An error occurred while retrieving pending users");
        }
    }

    public async Task<ApiResponse<IEnumerable<UserDto>>> GetAllUsersAsync(int pageNumber = 1, int pageSize = 20)
    {
        try
        {
            var users = await _userManager.Users
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    IsApproved = user.IsApproved,
                    Roles = roles.ToList()
                });
            }

            _logger.LogInformation("Retrieved {Count} users (page {Page})", userDtos.Count, pageNumber);

            return ApiResponse<IEnumerable<UserDto>>.SuccessResponse(userDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return ApiResponse<IEnumerable<UserDto>>.ErrorResponse(
                "An error occurred while retrieving users");
        }
    }

    public async Task<ApiResponse<bool>> ApproveUserAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            if (user.IsApproved)
            {
                return ApiResponse<bool>.ErrorResponse("User is already approved");
            }

            user.IsApproved = true;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Failed to approve user", errors);
            }

            // Send approval email
            await _emailService.SendApprovalEmailAsync(user.Email!, user.FirstName);

            _logger.LogInformation("User {UserId} ({Email}) approved successfully", userId, user.Email);

            return ApiResponse<bool>.SuccessResponse(true, "User approved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving user {UserId}", userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred while approving the user");
        }
    }

    public async Task<ApiResponse<bool>> RejectUserAsync(string userId, string? rejectionReason = null)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            if (user.IsApproved)
            {
                return ApiResponse<bool>.ErrorResponse("Cannot reject an already approved user");
            }

            // Send rejection email (note: rejectionReason is not used in email template yet)
            await _emailService.SendRejectionEmailAsync(user.Email!, user.FirstName);

            // Delete the rejected user
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Failed to reject user", errors);
            }

            _logger.LogInformation("User {UserId} ({Email}) rejected and deleted", userId, user.Email);

            return ApiResponse<bool>.SuccessResponse(true, "User rejected successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting user {UserId}", userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred while rejecting the user");
        }
    }

    public async Task<ApiResponse<bool>> AssignRoleAsync(string userId, string roleName)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                return ApiResponse<bool>.ErrorResponse($"Role '{roleName}' does not exist");
            }

            if (await _userManager.IsInRoleAsync(user, roleName))
            {
                return ApiResponse<bool>.ErrorResponse($"User already has the '{roleName}' role");
            }

            var result = await _userManager.AddToRoleAsync(user, roleName);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Failed to assign role", errors);
            }

            _logger.LogInformation("Role '{Role}' assigned to user {UserId} ({Email})",
                roleName, userId, user.Email);

            return ApiResponse<bool>.SuccessResponse(true, $"Role '{roleName}' assigned successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning role '{Role}' to user {UserId}", roleName, userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred while assigning the role");
        }
    }

    public async Task<ApiResponse<bool>> RemoveRoleAsync(string userId, string roleName)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            if (!await _userManager.IsInRoleAsync(user, roleName))
            {
                return ApiResponse<bool>.ErrorResponse($"User does not have the '{roleName}' role");
            }

            var result = await _userManager.RemoveFromRoleAsync(user, roleName);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Failed to remove role", errors);
            }

            _logger.LogInformation("Role '{Role}' removed from user {UserId} ({Email})",
                roleName, userId, user.Email);

            return ApiResponse<bool>.SuccessResponse(true, $"Role '{roleName}' removed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing role '{Role}' from user {UserId}", roleName, userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred while removing the role");
        }
    }
}
