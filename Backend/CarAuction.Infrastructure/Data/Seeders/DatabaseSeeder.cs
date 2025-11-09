using CarAuction.Domain.Entities;
using CarAuction.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Data.Seeders;

public class DatabaseSeeder
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ApplicationDbContext context,
        ILogger<DatabaseSeeder> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            await SeedRolesAsync();
            await SeedAdminUserAsync();
            await SeedSampleUsersAsync();
            await SeedSampleCarsAsync();
            await SeedSampleAuctionsAsync();
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

    private async Task SeedSampleUsersAsync()
    {
        // Check if sample users already exist
        var existingUser = await _userManager.FindByEmailAsync("user1@example.com");
        if (existingUser != null)
        {
            _logger.LogInformation("Sample users already exist");
            return;
        }

        var sampleUsers = new[]
        {
            new { Email = "user1@example.com", FirstName = "John", LastName = "Doe", Password = "User@123456" },
            new { Email = "user2@example.com", FirstName = "Jane", LastName = "Smith", Password = "User@123456" },
            new { Email = "bidder1@example.com", FirstName = "Alice", LastName = "Johnson", Password = "User@123456" },
            new { Email = "bidder2@example.com", FirstName = "Bob", LastName = "Williams", Password = "User@123456" },
        };

        foreach (var userData in sampleUsers)
        {
            var user = new ApplicationUser
            {
                UserName = userData.Email,
                Email = userData.Email,
                FirstName = userData.FirstName,
                LastName = userData.LastName,
                EmailConfirmed = true,
                IsApproved = true
            };

            var result = await _userManager.CreateAsync(user, userData.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                await _userManager.AddToRoleAsync(user, "Bidder");
                _logger.LogInformation("Sample user created: {Email}", userData.Email);
            }
            else
            {
                _logger.LogError("Failed to create sample user {Email}: {Errors}",
                    userData.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }

    private async Task SeedSampleCarsAsync()
    {
        // Check if sample cars already exist
        if (await _context.Cars.AnyAsync())
        {
            _logger.LogInformation("Sample cars already exist");
            return;
        }

        var sampleCars = new List<Car>
        {
            new Car
            {
                Make = "Toyota",
                Model = "Camry",
                Year = 2020,
                VIN = "1HGBH41JXMN109186",
                Mileage = 35000,
                Color = "Silver",
                Description = "Well-maintained Toyota Camry with full service history. Excellent condition, one owner.",
                ImageUrls = new List<string> { "https://example.com/camry1.jpg", "https://example.com/camry2.jpg" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Car
            {
                Make = "Honda",
                Model = "Accord",
                Year = 2019,
                VIN = "2HGFC2F59KH542371",
                Mileage = 42000,
                Color = "Black",
                Description = "Sporty Honda Accord with leather interior and navigation system. Very clean.",
                ImageUrls = new List<string> { "https://example.com/accord1.jpg" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Car
            {
                Make = "BMW",
                Model = "3 Series",
                Year = 2021,
                VIN = "WBA8E1C51HK895632",
                Mileage = 18000,
                Color = "White",
                Description = "Luxury BMW 3 Series with premium package. Like new condition with all service records.",
                ImageUrls = new List<string> { "https://example.com/bmw1.jpg", "https://example.com/bmw2.jpg", "https://example.com/bmw3.jpg" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Car
            {
                Make = "Mercedes-Benz",
                Model = "C-Class",
                Year = 2020,
                VIN = "W1KZF8DB5LA123456",
                Mileage = 28000,
                Color = "Blue",
                Description = "Elegant Mercedes C-Class with panoramic sunroof and premium sound system.",
                ImageUrls = new List<string> { "https://example.com/merc1.jpg" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Car
            {
                Make = "Audi",
                Model = "A4",
                Year = 2022,
                VIN = "WAUZZZ8K5DA123789",
                Mileage = 12000,
                Color = "Red",
                Description = "Brand new Audi A4 with Quattro all-wheel drive. Factory warranty remaining.",
                ImageUrls = new List<string> { "https://example.com/audi1.jpg", "https://example.com/audi2.jpg" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Car
            {
                Make = "Ford",
                Model = "Mustang",
                Year = 2018,
                VIN = "1FA6P8CF8J5123456",
                Mileage = 55000,
                Color = "Yellow",
                Description = "Classic Ford Mustang GT with 5.0L V8 engine. Powerful and iconic American muscle car.",
                ImageUrls = new List<string> { "https://example.com/mustang1.jpg" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _context.Cars.AddRangeAsync(sampleCars);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeded {Count} sample cars", sampleCars.Count);
    }

    private async Task SeedSampleAuctionsAsync()
    {
        // Check if sample auctions already exist
        if (await _context.Auctions.AnyAsync())
        {
            _logger.LogInformation("Sample auctions already exist");
            return;
        }

        var adminUser = await _userManager.FindByEmailAsync("admin@bravocars.com");
        if (adminUser == null)
        {
            _logger.LogWarning("Admin user not found, cannot seed auctions");
            return;
        }

        var cars = await _context.Cars.ToListAsync();
        if (!cars.Any())
        {
            _logger.LogWarning("No cars found, cannot seed auctions");
            return;
        }

        var now = DateTime.UtcNow;
        var sampleAuctions = new List<Auction>();

        // Active auctions
        for (int i = 0; i < Math.Min(3, cars.Count); i++)
        {
            sampleAuctions.Add(new Auction
            {
                Title = $"Premium {cars[i].Make} {cars[i].Model} Auction",
                Description = $"Don't miss this opportunity to bid on this excellent {cars[i].Year} {cars[i].Make} {cars[i].Model}!",
                StartingPrice = 15000 + (i * 5000),
                ReservePrice = 20000 + (i * 5000),
                CurrentPrice = null,
                CarId = cars[i].Id,
                SellerId = adminUser.Id,
                WinnerId = null,
                StartTime = now.AddHours(-2),
                EndTime = now.AddDays(3),
                Status = AuctionStatus.Active,
                CreatedAt = now.AddHours(-2),
                UpdatedAt = now.AddHours(-2)
            });
        }

        // Scheduled auctions
        if (cars.Count > 3)
        {
            for (int i = 3; i < Math.Min(5, cars.Count); i++)
            {
                sampleAuctions.Add(new Auction
                {
                    Title = $"{cars[i].Make} {cars[i].Model} - Coming Soon",
                    Description = $"Upcoming auction for this fantastic {cars[i].Year} {cars[i].Make} {cars[i].Model}. Mark your calendar!",
                    StartingPrice = 12000 + (i * 3000),
                    ReservePrice = 18000 + (i * 3000),
                    CurrentPrice = null,
                    CarId = cars[i].Id,
                    SellerId = adminUser.Id,
                    WinnerId = null,
                    StartTime = now.AddDays(2),
                    EndTime = now.AddDays(5),
                    Status = AuctionStatus.Scheduled,
                    CreatedAt = now,
                    UpdatedAt = now
                });
            }
        }

        // Completed auction (if there are enough cars)
        if (cars.Count > 5)
        {
            sampleAuctions.Add(new Auction
            {
                Title = $"{cars[5].Make} {cars[5].Model} - Sold",
                Description = $"This {cars[5].Year} {cars[5].Make} {cars[5].Model} has been successfully sold!",
                StartingPrice = 20000,
                ReservePrice = 25000,
                CurrentPrice = 28000,
                CarId = cars[5].Id,
                SellerId = adminUser.Id,
                WinnerId = null,
                StartTime = now.AddDays(-7),
                EndTime = now.AddDays(-4),
                Status = AuctionStatus.Completed,
                CreatedAt = now.AddDays(-7),
                UpdatedAt = now.AddDays(-4)
            });
        }

        await _context.Auctions.AddRangeAsync(sampleAuctions);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeded {Count} sample auctions", sampleAuctions.Count);
    }
}
