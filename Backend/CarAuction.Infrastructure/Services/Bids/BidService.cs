using CarAuction.Application.DTOs.Auth;
using CarAuction.Application.DTOs.Bid;
using CarAuction.Application.DTOs.Common;
using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Entities;
using CarAuction.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Services.Bids;

public class BidService : IBidService
{
    private readonly IBidRepository _bidRepository;
    private readonly IAuctionRepository _auctionRepository;
    private readonly ICarRepository _carRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ICacheService _cacheService;
    private readonly IEmailService _emailService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<BidService> _logger;

    public BidService(
        IBidRepository bidRepository,
        IAuctionRepository auctionRepository,
        ICarRepository carRepository,
        UserManager<ApplicationUser> userManager,
        ICacheService cacheService,
        IEmailService emailService,
        IUnitOfWork unitOfWork,
        ILogger<BidService> logger)
    {
        _bidRepository = bidRepository;
        _auctionRepository = auctionRepository;
        _carRepository = carRepository;
        _userManager = userManager;
        _cacheService = cacheService;
        _emailService = emailService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ApiResponse<BidDto>> PlaceBidAsync(string userId, PlaceBidDto placeBidDto)
    {
        var lockKey = $"auction:{placeBidDto.AuctionId}:bid";

        try
        {
            // Acquire distributed lock to prevent race conditions
            var lockAcquired = await _cacheService.AcquireLockAsync(lockKey, TimeSpan.FromSeconds(10));

            if (!lockAcquired)
            {
                return ApiResponse<BidDto>.ErrorResponse(
                    "Another bid is being processed. Please try again.");
            }

            var auction = await _auctionRepository.GetByIdAsync(placeBidDto.AuctionId);

            if (auction == null)
            {
                return ApiResponse<BidDto>.ErrorResponse("Auction not found");
            }

            // Validate auction status
            if (auction.Status != AuctionStatus.Active)
            {
                return ApiResponse<BidDto>.ErrorResponse(
                    $"Auction is not active. Current status: {auction.Status}");
            }

            // Validate auction time
            var now = DateTime.UtcNow;
            if (now < auction.StartTime)
            {
                return ApiResponse<BidDto>.ErrorResponse("Auction has not started yet");
            }

            if (now > auction.EndTime)
            {
                return ApiResponse<BidDto>.ErrorResponse("Auction has ended");
            }

            // Get car for starting price
            var car = await _carRepository.GetByIdAsync(auction.CarId);
            if (car == null)
            {
                return ApiResponse<BidDto>.ErrorResponse("Associated car not found");
            }

            // Validate bid amount
            var minimumBid = auction.CurrentPrice ?? auction.StartingPrice;
            if (placeBidDto.Amount <= minimumBid)
            {
                return ApiResponse<BidDto>.ErrorResponse(
                    $"Bid amount must be greater than ${minimumBid:N2}");
            }

            // Don't allow user to bid on their own auction (if they're the current winner)
            if (auction.WinnerId == userId)
            {
                return ApiResponse<BidDto>.ErrorResponse(
                    "You are already the highest bidder");
            }

            // Get previous winner for notification
            string? previousWinnerId = auction.WinnerId;

            // Create bid
            var bid = new Bid
            {
                AuctionId = placeBidDto.AuctionId,
                BidderId = userId,
                Amount = placeBidDto.Amount,
                PlacedAt = DateTime.UtcNow
            };

            // Update auction
            auction.CurrentPrice = placeBidDto.Amount;
            auction.WinnerId = userId;
            auction.UpdatedAt = DateTime.UtcNow;

            await _bidRepository.AddAsync(bid);
            _auctionRepository.Update(auction);
            await _unitOfWork.SaveChangesAsync();

            // Get bidder info
            var bidder = await _userManager.FindByIdAsync(userId);

            var bidDto = new BidDto
            {
                Id = bid.Id,
                AuctionId = bid.AuctionId,
                BidderId = bid.BidderId,
                Bidder = bidder != null ? new UserDto
                {
                    Id = bidder.Id,
                    Email = bidder.Email!,
                    FirstName = bidder.FirstName,
                    LastName = bidder.LastName,
                    PhoneNumber = bidder.PhoneNumber,
                    IsApproved = bidder.IsApproved,
                    Roles = (await _userManager.GetRolesAsync(bidder)).ToList()
                } : null!,
                Amount = bid.Amount,
                PlacedAt = bid.PlacedAt
            };

            _logger.LogInformation("Bid placed: {BidId} - User {UserId} bid ${Amount} on auction {AuctionId}",
                bid.Id, userId, bid.Amount, placeBidDto.AuctionId);

            // Send email notifications (async, don't wait)
            _ = Task.Run(async () =>
            {
                try
                {
                    // Notify current bidder
                    if (bidder != null)
                    {
                        await _emailService.SendBidPlacedNotificationAsync(
                            bidder.Email!,
                            bidder.FirstName,
                            auction.Id,
                            $"{car.Year} {car.Make} {car.Model}",
                            bid.Amount);
                    }

                    // Notify previous highest bidder they've been outbid
                    if (previousWinnerId != null)
                    {
                        var previousBidder = await _userManager.FindByIdAsync(previousWinnerId);
                        if (previousBidder != null)
                        {
                            await _emailService.SendOutbidNotificationAsync(
                                previousBidder.Email!,
                                previousBidder.FirstName,
                                auction.Id,
                                $"{car.Year} {car.Make} {car.Model}",
                                bid.Amount);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error sending bid notification emails");
                }
            });

            return ApiResponse<BidDto>.SuccessResponse(bidDto, "Bid placed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error placing bid on auction {AuctionId}", placeBidDto.AuctionId);
            return ApiResponse<BidDto>.ErrorResponse(
                "An error occurred while placing the bid");
        }
        finally
        {
            // Release lock
            await _cacheService.ReleaseLockAsync(lockKey);
        }
    }

    public async Task<ApiResponse<List<BidDto>>> GetBidsByAuctionIdAsync(int auctionId)
    {
        try
        {
            var bids = await _bidRepository.GetBidsByAuctionIdAsync(auctionId);

            var bidDtos = new List<BidDto>();
            foreach (var bid in bids)
            {
                var bidder = await _userManager.FindByIdAsync(bid.BidderId);

                bidDtos.Add(new BidDto
                {
                    Id = bid.Id,
                    AuctionId = bid.AuctionId,
                    BidderId = bid.BidderId,
                    Bidder = bidder != null ? new UserDto
                    {
                        Id = bidder.Id,
                        Email = bidder.Email!,
                        FirstName = bidder.FirstName,
                        LastName = bidder.LastName,
                        PhoneNumber = bidder.PhoneNumber,
                        IsApproved = bidder.IsApproved,
                        Roles = (await _userManager.GetRolesAsync(bidder)).ToList()
                    } : null!,
                    Amount = bid.Amount,
                    PlacedAt = bid.PlacedAt
                });
            }

            _logger.LogInformation("Retrieved {Count} bids for auction {AuctionId}",
                bidDtos.Count, auctionId);

            return ApiResponse<List<BidDto>>.SuccessResponse(bidDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bids for auction {AuctionId}", auctionId);
            return ApiResponse<List<BidDto>>.ErrorResponse(
                "An error occurred while retrieving bids");
        }
    }

    public async Task<ApiResponse<List<BidDto>>> GetBidsByUserIdAsync(string userId)
    {
        try
        {
            var bids = await _bidRepository.GetBidsByUserIdAsync(userId);

            var bidder = await _userManager.FindByIdAsync(userId);

            var bidDtos = bids.Select(bid => new BidDto
            {
                Id = bid.Id,
                AuctionId = bid.AuctionId,
                BidderId = bid.BidderId,
                Bidder = bidder != null ? new UserDto
                {
                    Id = bidder.Id,
                    Email = bidder.Email!,
                    FirstName = bidder.FirstName,
                    LastName = bidder.LastName,
                    PhoneNumber = bidder.PhoneNumber,
                    IsApproved = bidder.IsApproved,
                    Roles = new List<string>() // Skip loading roles for performance
                } : null!,
                Amount = bid.Amount,
                PlacedAt = bid.PlacedAt
            }).ToList();

            _logger.LogInformation("Retrieved {Count} bids for user {UserId}",
                bidDtos.Count, userId);

            return ApiResponse<List<BidDto>>.SuccessResponse(bidDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bids for user {UserId}", userId);
            return ApiResponse<List<BidDto>>.ErrorResponse(
                "An error occurred while retrieving bids");
        }
    }

    public async Task<ApiResponse<BidDto>> GetHighestBidAsync(int auctionId)
    {
        try
        {
            var highestBid = await _bidRepository.GetHighestBidAsync(auctionId);

            if (highestBid == null)
            {
                return ApiResponse<BidDto>.ErrorResponse("No bids found for this auction");
            }

            var bidder = await _userManager.FindByIdAsync(highestBid.BidderId);

            var bidDto = new BidDto
            {
                Id = highestBid.Id,
                AuctionId = highestBid.AuctionId,
                BidderId = highestBid.BidderId,
                Bidder = bidder != null ? new UserDto
                {
                    Id = bidder.Id,
                    Email = bidder.Email!,
                    FirstName = bidder.FirstName,
                    LastName = bidder.LastName,
                    PhoneNumber = bidder.PhoneNumber,
                    IsApproved = bidder.IsApproved,
                    Roles = (await _userManager.GetRolesAsync(bidder)).ToList()
                } : null!,
                Amount = highestBid.Amount,
                PlacedAt = highestBid.PlacedAt
            };

            return ApiResponse<BidDto>.SuccessResponse(bidDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving highest bid for auction {AuctionId}", auctionId);
            return ApiResponse<BidDto>.ErrorResponse(
                "An error occurred while retrieving the highest bid");
        }
    }
}
