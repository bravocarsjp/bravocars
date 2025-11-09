using CarAuction.Domain.Entities;

namespace CarAuction.Application.Interfaces.Services;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user, IList<string> roles);
    string GenerateRefreshToken();
    Task<string?> ValidateRefreshTokenAsync(string refreshToken);
}
