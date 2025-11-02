using CarAuction.Application.DTOs.Auth;
using CarAuction.Application.DTOs.Common;

namespace CarAuction.Application.Interfaces.Services;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto);
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto);
    Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken);
    Task<ApiResponse<bool>> LogoutAsync(string userId);
    Task<ApiResponse<UserDto>> GetCurrentUserAsync(string userId);
    Task<ApiResponse<UserDto>> UpdateProfileAsync(string userId, UpdateProfileDto updateProfileDto);
    Task<ApiResponse<bool>> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto);
}
