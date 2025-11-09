using CarAuction.Application.DTOs.Admin;
using CarAuction.Application.DTOs.Auth;
using CarAuction.Application.DTOs.Common;
using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Entities;
using CarAuction.Domain.Enums;
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
    private readonly IAuctionRepository _auctionRepository;
    private readonly IBidRepository _bidRepository;
    private readonly ICarRepository _carRepository;

    public AdminService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IEmailService emailService,
        ILogger<AdminService> logger,
        IAuctionRepository auctionRepository,
        IBidRepository bidRepository,
        ICarRepository carRepository)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _emailService = emailService;
        _logger = logger;
        _auctionRepository = auctionRepository;
        _bidRepository = bidRepository;
        _carRepository = carRepository;
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

    public async Task<ApiResponse<PaginatedListDto<AdminUserDto>>> GetAllUsersAsync(
        int pageNumber = 1,
        int pageSize = 20,
        string? searchTerm = null,
        string? role = null,
        string? status = null)
    {
        try
        {
            // Get all users first to filter out admins
            var allUsers = await _userManager.Users
                .OrderBy(u => u.Email)
                .ToListAsync();

            // Filter out users with Admin role and apply filters
            var nonAdminUsers = new List<ApplicationUser>();
            foreach (var user in allUsers)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                if (userRoles.Contains("Admin"))
                {
                    continue; // Skip admin users
                }

                // Apply search term filter (name or email)
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    var search = searchTerm.ToLower();
                    var matchesSearch =
                        (user.FirstName?.ToLower().Contains(search) ?? false) ||
                        (user.LastName?.ToLower().Contains(search) ?? false) ||
                        (user.Email?.ToLower().Contains(search) ?? false);

                    if (!matchesSearch)
                    {
                        continue;
                    }
                }

                // Apply role filter
                if (!string.IsNullOrWhiteSpace(role))
                {
                    if (!userRoles.Contains(role))
                    {
                        continue;
                    }
                }

                // Apply status filter
                if (!string.IsNullOrWhiteSpace(status))
                {
                    var userStatus = GetUserStatus(user);
                    if (!userStatus.Equals(status, StringComparison.OrdinalIgnoreCase))
                    {
                        continue;
                    }
                }

                nonAdminUsers.Add(user);
            }

            var totalCount = nonAdminUsers.Count;

            // Apply pagination after filtering
            var paginatedUsers = nonAdminUsers
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var adminUserDtos = new List<AdminUserDto>();
            foreach (var user in paginatedUsers)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userStatus = GetUserStatus(user);

                adminUserDtos.Add(new AdminUserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName ?? "",
                    LastName = user.LastName ?? "",
                    PhoneNumber = user.PhoneNumber,
                    Role = roles.FirstOrDefault() ?? "User", // Primary role
                    Roles = roles.ToList(),
                    Status = userStatus,
                    CreatedAt = user.CreatedAt,
                    ApprovedAt = user.ApprovedAt
                });
            }

            var paginatedResult = new PaginatedListDto<AdminUserDto>
            {
                Items = adminUserDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            _logger.LogInformation("Retrieved {Count} users (page {Page} of {TotalPages})",
                adminUserDtos.Count, pageNumber, paginatedResult.TotalPages);

            return ApiResponse<PaginatedListDto<AdminUserDto>>.SuccessResponse(paginatedResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return ApiResponse<PaginatedListDto<AdminUserDto>>.ErrorResponse(
                "An error occurred while retrieving users");
        }
    }

    public async Task<ApiResponse<bool>> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            // Update basic information
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.PhoneNumber = updateUserDto.PhoneNumber;

            // Update email if changed
            if (user.Email != updateUserDto.Email)
            {
                var emailExists = await _userManager.FindByEmailAsync(updateUserDto.Email);
                if (emailExists != null && emailExists.Id != userId)
                {
                    return ApiResponse<bool>.ErrorResponse("Email is already in use by another user");
                }

                user.Email = updateUserDto.Email;
                user.UserName = updateUserDto.Email;
                user.NormalizedEmail = updateUserDto.Email.ToUpperInvariant();
                user.NormalizedUserName = updateUserDto.Email.ToUpperInvariant();
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Failed to update user", errors);
            }

            // Update password if provided
            if (!string.IsNullOrWhiteSpace(updateUserDto.NewPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, updateUserDto.NewPassword);

                if (!passwordResult.Succeeded)
                {
                    var errors = passwordResult.Errors.Select(e => e.Description).ToList();
                    return ApiResponse<bool>.ErrorResponse("User updated but password change failed", errors);
                }
            }

            _logger.LogInformation("User {UserId} ({Email}) updated successfully", userId, user.Email);

            return ApiResponse<bool>.SuccessResponse(true, "User updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred while updating the user");
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

    public async Task<ApiResponse<bool>> SuspendUserAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow)
            {
                return ApiResponse<bool>.ErrorResponse("User is already suspended");
            }

            // Lock user account indefinitely (until manually activated)
            var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Failed to suspend user", errors);
            }

            _logger.LogInformation("User {UserId} ({Email}) suspended successfully", userId, user.Email);

            return ApiResponse<bool>.SuccessResponse(true, "User suspended successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error suspending user {UserId}", userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred while suspending the user");
        }
    }

    public async Task<ApiResponse<bool>> ActivateUserAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            if (!user.LockoutEnd.HasValue || user.LockoutEnd <= DateTimeOffset.UtcNow)
            {
                return ApiResponse<bool>.ErrorResponse("User is not suspended");
            }

            // Remove lockout by setting lockout end date to null
            var result = await _userManager.SetLockoutEndDateAsync(user, null);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Failed to activate user", errors);
            }

            _logger.LogInformation("User {UserId} ({Email}) activated successfully", userId, user.Email);

            return ApiResponse<bool>.SuccessResponse(true, "User activated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error activating user {UserId}", userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred while activating the user");
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

    public async Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync()
    {
        try
        {
            var now = DateTime.UtcNow;
            var today = now.Date;
            var weekStart = today.AddDays(-(int)today.DayOfWeek);
            var monthStart = new DateTime(now.Year, now.Month, 1);

            var stats = new DashboardStatsDto();

            // User Statistics
            var allUsers = await _userManager.Users.ToListAsync();
            stats.TotalUsers = allUsers.Count;
            stats.ActiveUsers = allUsers.Count(u => u.IsApproved);
            stats.PendingUsers = allUsers.Count(u => !u.IsApproved);
            stats.NewUsersToday = 0; // TODO: Add CreatedAt field to ApplicationUser
            stats.NewUsersThisWeek = 0;
            stats.NewUsersThisMonth = 0;

            // Auction Statistics
            var allAuctions = await _auctionRepository.GetAllAsync();
            stats.TotalAuctions = allAuctions.Count();
            stats.ActiveAuctions = allAuctions.Count(a => a.Status == AuctionStatus.Active && a.StartTime <= now && a.EndTime > now);
            stats.ScheduledAuctions = allAuctions.Count(a => a.Status == AuctionStatus.Scheduled);
            stats.CompletedAuctions = allAuctions.Count(a => a.Status == AuctionStatus.Completed);
            stats.CancelledAuctions = allAuctions.Count(a => a.Status == AuctionStatus.Cancelled);

            // Bidding Statistics
            var allBids = await _bidRepository.GetAllAsync();
            var bidsList = allBids.ToList();
            stats.TotalBids = bidsList.Count;
            stats.BidsToday = bidsList.Count(b => b.PlacedAt >= today);
            stats.BidsThisWeek = bidsList.Count(b => b.PlacedAt >= weekStart);
            stats.BidsThisMonth = bidsList.Count(b => b.PlacedAt >= monthStart);
            stats.AverageBidsPerAuction = stats.TotalAuctions > 0
                ? (decimal)stats.TotalBids / stats.TotalAuctions
                : 0;

            // Revenue Statistics (based on completed auctions)
            var completedAuctions = allAuctions.Where(a => a.Status == AuctionStatus.Completed).ToList();
            stats.TotalRevenueAllTime = completedAuctions.Sum(a => a.CurrentPrice ?? 0);
            stats.RevenueToday = completedAuctions.Where(a => a.EndTime >= today).Sum(a => a.CurrentPrice ?? 0);
            stats.RevenueThisWeek = completedAuctions.Where(a => a.EndTime >= weekStart).Sum(a => a.CurrentPrice ?? 0);
            stats.RevenueThisMonth = completedAuctions.Where(a => a.EndTime >= monthStart).Sum(a => a.CurrentPrice ?? 0);
            stats.AverageAuctionValue = completedAuctions.Count > 0
                ? completedAuctions.Average(a => a.CurrentPrice ?? 0)
                : 0;
            stats.HighestBidValue = bidsList.Count > 0 ? bidsList.Max(b => b.Amount) : 0;

            // Car Statistics
            var allCars = await _carRepository.GetAllAsync();
            stats.TotalCars = allCars.Count();
            stats.CarsWithActiveAuctions = allAuctions.Count(a => a.Status == AuctionStatus.Active && a.StartTime <= now && a.EndTime > now);
            stats.CarsWithCompletedAuctions = completedAuctions.Count;

            // Performance Metrics
            var auctionsWithBids = allAuctions.Where(a => bidsList.Any(b => b.AuctionId == a.Id)).Count();
            stats.AuctionCompletionRate = stats.TotalAuctions > 0
                ? (double)auctionsWithBids / stats.TotalAuctions * 100
                : 0;

            // Calculate average time to first bid
            var timesToFirstBid = new List<double>();
            foreach (var auction in allAuctions)
            {
                var firstBid = bidsList
                    .Where(b => b.AuctionId == auction.Id)
                    .OrderBy(b => b.PlacedAt)
                    .FirstOrDefault();
                if (firstBid != null)
                {
                    var timeToFirstBid = (firstBid.PlacedAt - auction.StartTime).TotalHours;
                    timesToFirstBid.Add(timeToFirstBid);
                }
            }
            stats.AverageTimeToFirstBid = timesToFirstBid.Count > 0
                ? timesToFirstBid.Average()
                : 0;

            // Most active hour
            var bidsByHour = bidsList.GroupBy(b => b.PlacedAt.Hour)
                .Select(g => new { Hour = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .FirstOrDefault();
            stats.MostActiveHour = bidsByHour?.Hour ?? 0;

            // Top Bidders (top 5)
            var topBidders = bidsList
                .GroupBy(b => b.BidderId)
                .Select(g => new
                {
                    UserId = g.Key,
                    TotalBids = g.Count(),
                    TotalBidAmount = g.Sum(b => b.Amount),
                    AuctionsWon = completedAuctions.Count(a => a.WinnerId == g.Key)
                })
                .OrderByDescending(x => x.TotalBidAmount)
                .Take(5)
                .ToList();

            foreach (var bidder in topBidders)
            {
                var user = await _userManager.FindByIdAsync(bidder.UserId);
                if (user != null)
                {
                    stats.TopBidders.Add(new TopBidderDto
                    {
                        UserId = bidder.UserId,
                        FullName = $"{user.FirstName} {user.LastName}",
                        Email = user.Email!,
                        TotalBids = bidder.TotalBids,
                        TotalBidAmount = bidder.TotalBidAmount,
                        AuctionsWon = bidder.AuctionsWon
                    });
                }
            }

            // Top Auctions (top 5 by final price)
            var topAuctions = completedAuctions
                .OrderByDescending(a => a.CurrentPrice)
                .Take(5)
                .ToList();

            foreach (var auction in topAuctions)
            {
                var car = await _carRepository.GetByIdAsync(auction.CarId);
                var auctionBids = bidsList.Count(b => b.AuctionId == auction.Id);

                stats.TopAuctions.Add(new TopAuctionDto
                {
                    AuctionId = auction.Id,
                    Title = auction.Title,
                    CarDetails = car != null ? $"{car.Year} {car.Make} {car.Model}" : "Unknown",
                    FinalPrice = auction.CurrentPrice ?? 0,
                    TotalBids = auctionBids,
                    EndTime = auction.EndTime
                });
            }

            _logger.LogInformation("Dashboard statistics retrieved successfully");

            return ApiResponse<DashboardStatsDto>.SuccessResponse(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard statistics");
            return ApiResponse<DashboardStatsDto>.ErrorResponse(
                "An error occurred while retrieving dashboard statistics");
        }
    }

    public async Task<ApiResponse<List<AuctionPerformanceDto>>> GetAuctionPerformanceReportAsync(
        DateTime? startDate = null, DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
            var end = endDate ?? DateTime.UtcNow;

            var auctions = await _auctionRepository.GetAllAsync();
            var filteredAuctions = auctions
                .Where(a => a.StartTime >= start && a.StartTime <= end)
                .ToList();

            var allBids = await _bidRepository.GetAllAsync();
            var bidsList = allBids.ToList();

            var performanceList = new List<AuctionPerformanceDto>();

            foreach (var auction in filteredAuctions)
            {
                var car = await _carRepository.GetByIdAsync(auction.CarId);
                var auctionBids = bidsList.Where(b => b.AuctionId == auction.Id).ToList();
                var firstBid = auctionBids.OrderBy(b => b.PlacedAt).FirstOrDefault();
                var uniqueBidders = auctionBids.Select(b => b.BidderId).Distinct().Count();

                var currentPrice = auction.CurrentPrice ?? 0;
                var priceIncrease = currentPrice - auction.StartingPrice;
                var priceIncreasePercentage = auction.StartingPrice > 0
                    ? (double)(priceIncrease / auction.StartingPrice) * 100
                    : 0;

                performanceList.Add(new AuctionPerformanceDto
                {
                    AuctionId = auction.Id,
                    Title = auction.Title,
                    CarDetails = car != null ? $"{car.Year} {car.Make} {car.Model}" : "Unknown",
                    StartingPrice = auction.StartingPrice,
                    CurrentPrice = currentPrice,
                    ReservePrice = auction.ReservePrice,
                    TotalBids = auctionBids.Count,
                    UniqueBidders = uniqueBidders,
                    StartTime = auction.StartTime,
                    EndTime = auction.EndTime,
                    Status = auction.Status.ToString(),
                    TimeToFirstBid = firstBid != null
                        ? firstBid.PlacedAt - auction.StartTime
                        : TimeSpan.Zero,
                    PriceIncrease = priceIncrease,
                    PriceIncreasePercentage = priceIncreasePercentage
                });
            }

            var orderedList = performanceList.OrderByDescending(p => p.TotalBids).ToList();

            _logger.LogInformation("Retrieved performance report for {Count} auctions", orderedList.Count);

            return ApiResponse<List<AuctionPerformanceDto>>.SuccessResponse(orderedList);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving auction performance report");
            return ApiResponse<List<AuctionPerformanceDto>>.ErrorResponse(
                "An error occurred while retrieving auction performance report");
        }
    }

    public async Task<ApiResponse<List<UserActivityDto>>> GetUserActivityReportAsync(
        int pageNumber = 1, int pageSize = 20)
    {
        try
        {
            var allBids = await _bidRepository.GetAllAsync();
            var bidsList = allBids.ToList();

            var auctions = await _auctionRepository.GetAllAsync();
            var completedAuctions = auctions.Where(a => a.Status == AuctionStatus.Completed).ToList();

            var users = await _userManager.Users
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var activityList = new List<UserActivityDto>();

            foreach (var user in users)
            {
                var userBids = bidsList.Where(b => b.BidderId == user.Id).ToList();
                var auctionsWon = completedAuctions.Count(a => a.WinnerId == user.Id);

                activityList.Add(new UserActivityDto
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email!,
                    RegistrationDate = DateTime.UtcNow, // TODO: Add CreatedAt field
                    LastLoginDate = null, // TODO: Add LastLoginDate field
                    TotalBidsPlaced = userBids.Count,
                    AuctionsWon = auctionsWon,
                    TotalAmountBid = userBids.Sum(b => b.Amount),
                    TotalAmountWon = completedAuctions
                        .Where(a => a.WinnerId == user.Id)
                        .Sum(a => a.CurrentPrice ?? 0),
                    IsActive = user.IsApproved
                });
            }

            var orderedList = activityList.OrderByDescending(a => a.TotalBidsPlaced).ToList();

            _logger.LogInformation("Retrieved user activity report for {Count} users (page {Page})",
                orderedList.Count, pageNumber);

            return ApiResponse<List<UserActivityDto>>.SuccessResponse(orderedList);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user activity report");
            return ApiResponse<List<UserActivityDto>>.ErrorResponse(
                "An error occurred while retrieving user activity report");
        }
    }

    public async Task<ApiResponse<List<RevenueReportDto>>> GetRevenueReportAsync(
        DateTime startDate, DateTime endDate)
    {
        try
        {
            var auctions = await _auctionRepository.GetAllAsync();
            var completedAuctions = auctions
                .Where(a => a.Status == AuctionStatus.Completed &&
                           a.EndTime >= startDate &&
                           a.EndTime <= endDate)
                .ToList();

            var allBids = await _bidRepository.GetAllAsync();
            var bidsList = allBids.ToList();

            var revenueByDay = completedAuctions
                .GroupBy(a => a.EndTime.Date)
                .Select(g => new RevenueReportDto
                {
                    Date = g.Key,
                    AuctionsCompleted = g.Count(),
                    TotalRevenue = g.Sum(a => a.CurrentPrice ?? 0),
                    TotalBids = bidsList.Count(b => g.Any(a => a.Id == b.AuctionId)),
                    AverageAuctionValue = g.Average(a => a.CurrentPrice ?? 0)
                })
                .OrderBy(r => r.Date)
                .ToList();

            _logger.LogInformation("Retrieved revenue report for {Days} days", revenueByDay.Count);

            return ApiResponse<List<RevenueReportDto>>.SuccessResponse(revenueByDay);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving revenue report");
            return ApiResponse<List<RevenueReportDto>>.ErrorResponse(
                "An error occurred while retrieving revenue report");
        }
    }

    // Helper method to determine user status
    private string GetUserStatus(ApplicationUser user)
    {
        if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow)
        {
            return "Suspended";
        }
        else if (!user.IsApproved)
        {
            return "Pending";
        }
        else
        {
            return "Active";
        }
    }
}
