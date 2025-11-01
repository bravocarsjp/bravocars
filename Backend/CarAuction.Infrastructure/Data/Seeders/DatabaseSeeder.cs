using CarAuction.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Data.Seeders;

public class DatabaseSeeder
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<DatabaseSeeder> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            await SeedRolesAsync();
            await SeedAdminUserAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    private async Task SeedRolesAsync()
    {
        string[] roleNames = { "Admin", "User", "Bidder" };

        foreach (var roleName in roleNames)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                var role = new IdentityRole(roleName);
                var result = await _roleManager.CreateAsync(role);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Role '{RoleName}' created successfully", roleName);
                }
                else
                {
                    _logger.LogError("Failed to create role '{RoleName}': {Errors}",
                        roleName, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                _logger.LogInformation("Role '{RoleName}' already exists", roleName);
            }
        }
    }

    private async Task SeedAdminUserAsync()
    {
        const string adminEmail = "admin@bravocars.com";
        const string adminPassword = "Admin@123456"; // TODO: Read from environment variable

        var existingAdmin = await _userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin != null)
        {
            _logger.LogInformation("Admin user already exists");
            return;
        }

        var adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            EmailConfirmed = true,
            IsApproved = true
        };

        var result = await _userManager.CreateAsync(adminUser, adminPassword);

        if (result.Succeeded)
        {
            // Assign Admin and User roles
            await _userManager.AddToRoleAsync(adminUser, "Admin");
            await _userManager.AddToRoleAsync(adminUser, "User");

            _logger.LogInformation("Admin user created successfully with email: {Email}", adminEmail);
            _logger.LogWarning("IMPORTANT: Default admin password is '{Password}'. Change it immediately!",
                adminPassword);
        }
        else
        {
            _logger.LogError("Failed to create admin user: {Errors}",
                string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }
}
