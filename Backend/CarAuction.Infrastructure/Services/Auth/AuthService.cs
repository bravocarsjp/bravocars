using CarAuction.Application.DTOs.Auth;
using CarAuction.Application.DTOs.Common;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Services.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        IEmailService emailService,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            // Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email is already registered");
            }

            // Create new user
            var user = new ApplicationUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
                IsApproved = false // Requires admin approval
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<AuthResponseDto>.ErrorResponse("Registration failed", errors);
            }

            // Assign default role
            await _userManager.AddToRoleAsync(user, "User");

            // Send registration email
            await _emailService.SendRegistrationEmailAsync(user.Email!, user.FirstName);

            _logger.LogInformation("User {Email} registered successfully. Pending approval.", user.Email);

            return ApiResponse<AuthResponseDto>.SuccessResponse(
                null!,
                "Registration successful. Your account is pending approval.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration for {Email}", registerDto.Email);
            return ApiResponse<AuthResponseDto>.ErrorResponse("An error occurred during registration");
        }
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse("Invalid email or password");
            }

            // Check if user is approved
            if (!user.IsApproved)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Your account is pending approval. Please wait for admin approval.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                if (result.IsLockedOut)
                {
                    return ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Account is locked due to multiple failed login attempts. Please try again later.");
                }

                return ApiResponse<AuthResponseDto>.ErrorResponse("Invalid email or password");
            }

            // Generate tokens
            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // TODO: Store refresh token in database for validation

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                IsApproved = user.IsApproved,
                Roles = roles.ToList()
            };

            var authResponse = new AuthResponseDto
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(1), // TODO: Get from configuration
                User = userDto
            };

            _logger.LogInformation("User {Email} logged in successfully", user.Email);

            return ApiResponse<AuthResponseDto>.SuccessResponse(authResponse, "Login successful");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", loginDto.Email);
            return ApiResponse<AuthResponseDto>.ErrorResponse("An error occurred during login");
        }
    }

    public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var validatedToken = await _tokenService.ValidateRefreshTokenAsync(refreshToken);

            if (validatedToken == null)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse("Invalid refresh token");
            }

            // TODO: Retrieve user from stored refresh token
            // For now, return error as token storage is not implemented

            return ApiResponse<AuthResponseDto>.ErrorResponse(
                "Refresh token functionality requires database implementation");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return ApiResponse<AuthResponseDto>.ErrorResponse("An error occurred during token refresh");
        }
    }

    public async Task<ApiResponse<bool>> LogoutAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return ApiResponse<bool>.ErrorResponse("User not found");
            }

            // TODO: Revoke refresh tokens in database

            await _signInManager.SignOutAsync();

            _logger.LogInformation("User {UserId} logged out successfully", userId);

            return ApiResponse<bool>.SuccessResponse(true, "Logout successful");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout for user {UserId}", userId);
            return ApiResponse<bool>.ErrorResponse("An error occurred during logout");
        }
    }

    public async Task<ApiResponse<UserDto>> GetCurrentUserAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return ApiResponse<UserDto>.ErrorResponse("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                IsApproved = user.IsApproved,
                Roles = roles.ToList()
            };

            return ApiResponse<UserDto>.SuccessResponse(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user {UserId}", userId);
            return ApiResponse<UserDto>.ErrorResponse("An error occurred while retrieving user information");
        }
    }
}
