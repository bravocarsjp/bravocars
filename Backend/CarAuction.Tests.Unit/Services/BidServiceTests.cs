using CarAuction.Application.DTOs.Bid;
using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Entities;
using CarAuction.Domain.Enums;
using CarAuction.Infrastructure.Services.Bids;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;

namespace CarAuction.Tests.Unit.Services;

public class BidServiceTests
{
    private readonly Mock<IBidRepository> _mockBidRepository;
    private readonly Mock<IAuctionRepository> _mockAuctionRepository;
    private readonly Mock<ICarRepository> _mockCarRepository;
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly Mock<ICacheService> _mockCacheService;
    private readonly Mock<IEmailService> _mockEmailService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<ILogger<BidService>> _mockLogger;
    private readonly Mock<IAuctionHubService> _mockAuctionHubService;
    private readonly BidService _bidService;

    public BidServiceTests()
    {
        _mockBidRepository = new Mock<IBidRepository>();
        _mockAuctionRepository = new Mock<IAuctionRepository>();
        _mockCarRepository = new Mock<ICarRepository>();
        _mockCacheService = new Mock<ICacheService>();
        _mockEmailService = new Mock<IEmailService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockLogger = new Mock<ILogger<BidService>>();
        _mockAuctionHubService = new Mock<IAuctionHubService>();

        // Mock UserManager
        var mockUserStore = new Mock<IUserStore<ApplicationUser>>();
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(
            mockUserStore.Object, null, null, null, null, null, null, null, null);

        _bidService = new BidService(
            _mockBidRepository.Object,
            _mockAuctionRepository.Object,
            _mockCarRepository.Object,
            _mockUserManager.Object,
            _mockCacheService.Object,
            _mockEmailService.Object,
            _mockUnitOfWork.Object,
            _mockLogger.Object,
            _mockAuctionHubService.Object);
    }

    #region PlaceBidAsync Tests

    [Fact]
    public async Task PlaceBidAsync_WhenLockCannotBeAcquired_ShouldReturnError()
    {
        // Arrange
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 10000 };
        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(false);

        // Act
        var result = await _bidService.PlaceBidAsync("user1", placeBidDto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("Another bid is being processed");
    }

    [Fact]
    public async Task PlaceBidAsync_WhenAuctionNotFound_ShouldReturnError()
    {
        // Arrange
        var placeBidDto = new PlaceBidDto { AuctionId = 999, Amount = 10000 };
        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(999))
            .ReturnsAsync((Auction?)null);

        // Act
        var result = await _bidService.PlaceBidAsync("user1", placeBidDto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("Auction not found");
        _mockCacheService.Verify(x => x.ReleaseLockAsync(It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task PlaceBidAsync_WhenAuctionNotActive_ShouldReturnError()
    {
        // Arrange
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 10000 };
        var auction = new Auction
        {
            Id = 1,
            Status = AuctionStatus.Completed,
            StartTime = DateTime.UtcNow.AddDays(-2),
            EndTime = DateTime.UtcNow.AddDays(-1)
        };

        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(auction);

        // Act
        var result = await _bidService.PlaceBidAsync("user1", placeBidDto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("not active");
    }

    [Fact]
    public async Task PlaceBidAsync_WhenAuctionNotStarted_ShouldReturnError()
    {
        // Arrange
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 10000 };
        var auction = new Auction
        {
            Id = 1,
            Status = AuctionStatus.Active,
            StartTime = DateTime.UtcNow.AddDays(1), // Future start time
            EndTime = DateTime.UtcNow.AddDays(2)
        };

        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(auction);

        // Act
        var result = await _bidService.PlaceBidAsync("user1", placeBidDto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("has not started yet");
    }

    [Fact]
    public async Task PlaceBidAsync_WhenAuctionEnded_ShouldReturnError()
    {
        // Arrange
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 10000 };
        var auction = new Auction
        {
            Id = 1,
            Status = AuctionStatus.Active,
            StartTime = DateTime.UtcNow.AddDays(-2),
            EndTime = DateTime.UtcNow.AddDays(-1) // Past end time
        };

        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(auction);

        // Act
        var result = await _bidService.PlaceBidAsync("user1", placeBidDto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("has ended");
    }

    [Fact]
    public async Task PlaceBidAsync_WhenBidTooLow_ShouldReturnError()
    {
        // Arrange
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 9000 };
        var auction = new Auction
        {
            Id = 1,
            CarId = 1,
            Status = AuctionStatus.Active,
            StartTime = DateTime.UtcNow.AddDays(-1),
            EndTime = DateTime.UtcNow.AddDays(1),
            StartingPrice = 10000,
            CurrentPrice = 10000
        };
        var car = new Car { Id = 1, Make = "Toyota", Model = "Camry", Year = 2020 };

        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(auction);
        _mockCarRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(car);

        // Act
        var result = await _bidService.PlaceBidAsync("user1", placeBidDto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("must be greater than");
    }

    [Fact]
    public async Task PlaceBidAsync_WhenUserAlreadyHighestBidder_ShouldReturnError()
    {
        // Arrange
        var userId = "user1";
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 11000 };
        var auction = new Auction
        {
            Id = 1,
            CarId = 1,
            Status = AuctionStatus.Active,
            StartTime = DateTime.UtcNow.AddDays(-1),
            EndTime = DateTime.UtcNow.AddDays(1),
            StartingPrice = 10000,
            CurrentPrice = 10000,
            WinnerId = userId // User is already the winner
        };
        var car = new Car { Id = 1, Make = "Toyota", Model = "Camry", Year = 2020 };

        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(auction);
        _mockCarRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(car);

        // Act
        var result = await _bidService.PlaceBidAsync(userId, placeBidDto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("already the highest bidder");
    }

    [Fact]
    public async Task PlaceBidAsync_WhenValid_ShouldPlaceBidSuccessfully()
    {
        // Arrange
        var userId = "user1";
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 11000 };
        var auction = new Auction
        {
            Id = 1,
            CarId = 1,
            Status = AuctionStatus.Active,
            StartTime = DateTime.UtcNow.AddDays(-1),
            EndTime = DateTime.UtcNow.AddDays(1),
            StartingPrice = 10000,
            CurrentPrice = 10000,
            WinnerId = "user2" // Different user is currently winning
        };
        var car = new Car { Id = 1, Make = "Toyota", Model = "Camry", Year = 2020 };
        var user = new ApplicationUser
        {
            Id = userId,
            Email = "test@example.com",
            FirstName = "John",
            LastName = "Doe",
            IsApproved = true
        };

        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(auction);
        _mockCarRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(car);
        _mockUserManager.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "Bidder" });
        _mockBidRepository.Setup(x => x.AddAsync(It.IsAny<Bid>()))
            .ReturnsAsync((Bid b) => b);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);
        _mockBidRepository.Setup(x => x.GetBidCountByAuctionIdAsync(1))
            .ReturnsAsync(5);

        // Act
        var result = await _bidService.PlaceBidAsync(userId, placeBidDto);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Amount.Should().Be(11000);
        result.Data.BidderId.Should().Be(userId);
        result.Data.AuctionId.Should().Be(1);

        // Verify bid was added
        _mockBidRepository.Verify(x => x.AddAsync(It.Is<Bid>(b =>
            b.AuctionId == 1 &&
            b.BidderId == userId &&
            b.Amount == 11000
        )), Times.Once);

        // Verify auction was updated
        _mockAuctionRepository.Verify(x => x.Update(It.Is<Auction>(a =>
            a.CurrentPrice == 11000 &&
            a.WinnerId == userId
        )), Times.Once);

        // Verify changes were saved
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);

        // Verify lock was released
        _mockCacheService.Verify(x => x.ReleaseLockAsync(It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task PlaceBidAsync_WhenValid_ShouldBroadcastViaSignalR()
    {
        // Arrange
        var userId = "user1";
        var placeBidDto = new PlaceBidDto { AuctionId = 1, Amount = 11000 };
        var auction = new Auction
        {
            Id = 1,
            CarId = 1,
            Status = AuctionStatus.Active,
            StartTime = DateTime.UtcNow.AddDays(-1),
            EndTime = DateTime.UtcNow.AddDays(1),
            StartingPrice = 10000,
            CurrentPrice = 10000
        };
        var car = new Car { Id = 1, Make = "Toyota", Model = "Camry", Year = 2020 };
        var user = new ApplicationUser
        {
            Id = userId,
            Email = "test@example.com",
            FirstName = "John",
            LastName = "Doe",
            IsApproved = true
        };

        _mockCacheService.Setup(x => x.AcquireLockAsync(It.IsAny<string>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        _mockAuctionRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(auction);
        _mockCarRepository.Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(car);
        _mockUserManager.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "Bidder" });
        _mockBidRepository.Setup(x => x.AddAsync(It.IsAny<Bid>()))
            .ReturnsAsync((Bid b) => b);
        _mockBidRepository.Setup(x => x.GetBidCountByAuctionIdAsync(1))
            .ReturnsAsync(5);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);

        // Act
        var result = await _bidService.PlaceBidAsync(userId, placeBidDto);

        // Assert
        result.Success.Should().BeTrue();

        // Give SignalR broadcast task time to execute
        await Task.Delay(100);

        // Verify SignalR broadcast was called
        _mockAuctionHubService.Verify(x => x.BroadcastBidPlacedAsync(
            1,
            It.Is<object>(obj => true)
        ), Times.Once);
    }

    #endregion

    #region GetBidsByAuctionIdAsync Tests

    [Fact]
    public async Task GetBidsByAuctionIdAsync_WhenBidsExist_ShouldReturnBids()
    {
        // Arrange
        var auctionId = 1;
        var bids = new List<Bid>
        {
            new() { Id = 1, AuctionId = auctionId, BidderId = "user1", Amount = 10000, PlacedAt = DateTime.UtcNow },
            new() { Id = 2, AuctionId = auctionId, BidderId = "user2", Amount = 11000, PlacedAt = DateTime.UtcNow }
        };
        var user1 = new ApplicationUser { Id = "user1", Email = "user1@test.com", FirstName = "John", LastName = "Doe" };
        var user2 = new ApplicationUser { Id = "user2", Email = "user2@test.com", FirstName = "Jane", LastName = "Smith" };

        _mockBidRepository.Setup(x => x.GetBidsByAuctionIdAsync(auctionId))
            .ReturnsAsync(bids);
        _mockUserManager.Setup(x => x.FindByIdAsync("user1"))
            .ReturnsAsync(user1);
        _mockUserManager.Setup(x => x.FindByIdAsync("user2"))
            .ReturnsAsync(user2);
        _mockUserManager.Setup(x => x.GetRolesAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(new List<string> { "Bidder" });

        // Act
        var result = await _bidService.GetBidsByAuctionIdAsync(auctionId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().HaveCount(2);
        result.Data[0].Amount.Should().Be(10000);
        result.Data[1].Amount.Should().Be(11000);
    }

    [Fact]
    public async Task GetBidsByAuctionIdAsync_WhenNoBids_ShouldReturnEmptyList()
    {
        // Arrange
        var auctionId = 1;
        _mockBidRepository.Setup(x => x.GetBidsByAuctionIdAsync(auctionId))
            .ReturnsAsync(new List<Bid>());

        // Act
        var result = await _bidService.GetBidsByAuctionIdAsync(auctionId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().BeEmpty();
    }

    #endregion

    #region GetHighestBidAsync Tests

    [Fact]
    public async Task GetHighestBidAsync_WhenNoBids_ShouldReturnError()
    {
        // Arrange
        var auctionId = 1;
        _mockBidRepository.Setup(x => x.GetHighestBidAsync(auctionId))
            .ReturnsAsync((Bid?)null);

        // Act
        var result = await _bidService.GetHighestBidAsync(auctionId);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("No bids found");
    }

    [Fact]
    public async Task GetHighestBidAsync_WhenBidExists_ShouldReturnHighestBid()
    {
        // Arrange
        var auctionId = 1;
        var highestBid = new Bid { Id = 5, AuctionId = auctionId, BidderId = "user1", Amount = 15000, PlacedAt = DateTime.UtcNow };
        var user = new ApplicationUser { Id = "user1", Email = "user1@test.com", FirstName = "John", LastName = "Doe", IsApproved = true };

        _mockBidRepository.Setup(x => x.GetHighestBidAsync(auctionId))
            .ReturnsAsync(highestBid);
        _mockUserManager.Setup(x => x.FindByIdAsync("user1"))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "Bidder" });

        // Act
        var result = await _bidService.GetHighestBidAsync(auctionId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Amount.Should().Be(15000);
        result.Data.BidderId.Should().Be("user1");
    }

    #endregion
}
