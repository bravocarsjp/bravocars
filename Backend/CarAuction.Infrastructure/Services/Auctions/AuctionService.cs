using CarAuction.Application.DTOs.Auction;
using CarAuction.Application.DTOs.Car;
using CarAuction.Application.DTOs.Common;
using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Entities;
using CarAuction.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Services.Auctions;

public class AuctionService : IAuctionService
{
    private readonly IAuctionRepository _auctionRepository;
    private readonly ICarRepository _carRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AuctionService> _logger;

    public AuctionService(
        IAuctionRepository auctionRepository,
        ICarRepository carRepository,
        IUnitOfWork unitOfWork,
        ILogger<AuctionService> logger)
    {
        _auctionRepository = auctionRepository;
        _carRepository = carRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ApiResponse<PaginatedResult<AuctionDto>>> GetAllAuctionsAsync(
        int pageNumber,
        int pageSize,
        AuctionStatus? status = null)
    {
        try
        {
            var (auctions, totalCount) = await _auctionRepository.GetPagedAsync(
                pageNumber,
                pageSize,
                predicate: status.HasValue ? a => a.Status == status.Value : null,
                orderBy: a => a.StartTime,
                ascending: false);

            var auctionDtos = new List<AuctionDto>();
            foreach (var auction in auctions)
            {
                var car = await _carRepository.GetByIdAsync(auction.CarId);

                auctionDtos.Add(new AuctionDto
                {
                    Id = auction.Id,
                    Title = auction.Title,
                    Description = auction.Description,
                    StartingPrice = auction.StartingPrice,
                    ReservePrice = auction.ReservePrice,
                    CurrentPrice = auction.CurrentPrice,
                    StartTime = auction.StartTime,
                    EndTime = auction.EndTime,
                    Status = auction.Status,
                    CarId = auction.CarId,
                    Car = car != null ? new CarDto
                    {
                        Id = car.Id,
                        Make = car.Make,
                        Model = car.Model,
                        Year = car.Year,
                        VIN = car.VIN ?? string.Empty,
                        Mileage = car.Mileage,
                        Color = car.Color,
                        Description = car.Description,
                        ImageUrls = car.ImageUrls,
                        CreatedAt = car.CreatedAt,
                        UpdatedAt = car.UpdatedAt
                    } : null,
                    SellerId = auction.SellerId,
                    WinnerId = auction.WinnerId,
                    CreatedAt = auction.CreatedAt,
                    UpdatedAt = auction.UpdatedAt
                });
            }

            var paginatedResult = new PaginatedResult<AuctionDto>
            {
                Items = auctionDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            _logger.LogInformation("Retrieved {Count} auctions (page {Page}/{TotalPages}, status: {Status})",
                auctionDtos.Count, pageNumber, paginatedResult.TotalPages, status?.ToString() ?? "All");

            return ApiResponse<PaginatedResult<AuctionDto>>.SuccessResponse(paginatedResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving auctions");
            return ApiResponse<PaginatedResult<AuctionDto>>.ErrorResponse(
                "An error occurred while retrieving auctions");
        }
    }

    public async Task<ApiResponse<AuctionDto>> GetAuctionByIdAsync(int id)
    {
        try
        {
            var auction = await _auctionRepository.GetByIdAsync(id);

            if (auction == null)
            {
                return ApiResponse<AuctionDto>.ErrorResponse("Auction not found");
            }

            var car = await _carRepository.GetByIdAsync(auction.CarId);

            var auctionDto = new AuctionDto
            {
                Id = auction.Id,
                Title = auction.Title,
                Description = auction.Description,
                StartingPrice = auction.StartingPrice,
                ReservePrice = auction.ReservePrice,
                CurrentPrice = auction.CurrentPrice,
                StartTime = auction.StartTime,
                EndTime = auction.EndTime,
                Status = auction.Status,
                CarId = auction.CarId,
                Car = car != null ? new CarDto
                {
                    Id = car.Id,
                    Make = car.Make,
                    Model = car.Model,
                    Year = car.Year,
                    VIN = car.VIN ?? string.Empty,
                    Mileage = car.Mileage,
                    Color = car.Color,
                    Description = car.Description,
                    ImageUrls = car.ImageUrls,
                    CreatedAt = car.CreatedAt,
                    UpdatedAt = car.UpdatedAt
                } : null,
                SellerId = auction.SellerId,
                WinnerId = auction.WinnerId,
                CreatedAt = auction.CreatedAt,
                UpdatedAt = auction.UpdatedAt
            };

            return ApiResponse<AuctionDto>.SuccessResponse(auctionDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving auction {AuctionId}", id);
            return ApiResponse<AuctionDto>.ErrorResponse(
                "An error occurred while retrieving the auction");
        }
    }

    public async Task<ApiResponse<AuctionDto>> CreateAuctionAsync(CreateAuctionDto createAuctionDto)
    {
        try
        {
            // Verify car exists
            var car = await _carRepository.GetByIdAsync(createAuctionDto.CarId);
            if (car == null)
            {
                return ApiResponse<AuctionDto>.ErrorResponse("Car not found");
            }

            // Validate dates
            if (createAuctionDto.StartTime >= createAuctionDto.EndTime)
            {
                return ApiResponse<AuctionDto>.ErrorResponse(
                    "Start time must be before end time");
            }

            if (createAuctionDto.StartTime < DateTime.UtcNow)
            {
                return ApiResponse<AuctionDto>.ErrorResponse(
                    "Start time cannot be in the past");
            }

            var auction = new Auction
            {
                Title = createAuctionDto.Title,
                Description = createAuctionDto.Description,
                StartingPrice = createAuctionDto.StartingPrice,
                ReservePrice = createAuctionDto.ReservePrice,
                CurrentPrice = null,
                CarId = createAuctionDto.CarId,
                SellerId = createAuctionDto.SellerId,
                WinnerId = null,
                StartTime = createAuctionDto.StartTime,
                EndTime = createAuctionDto.EndTime,
                Status = createAuctionDto.StartTime > DateTime.UtcNow
                    ? AuctionStatus.Scheduled
                    : AuctionStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _auctionRepository.AddAsync(auction);
            await _unitOfWork.SaveChangesAsync();

            var auctionDto = new AuctionDto
            {
                Id = auction.Id,
                Title = auction.Title,
                Description = auction.Description,
                StartingPrice = auction.StartingPrice,
                ReservePrice = auction.ReservePrice,
                CurrentPrice = auction.CurrentPrice,
                StartTime = auction.StartTime,
                EndTime = auction.EndTime,
                Status = auction.Status,
                CarId = auction.CarId,
                Car = new CarDto
                {
                    Id = car.Id,
                    Make = car.Make,
                    Model = car.Model,
                    Year = car.Year,
                    VIN = car.VIN ?? string.Empty,
                    Mileage = car.Mileage,
                    Color = car.Color,
                    Description = car.Description,
                    ImageUrls = car.ImageUrls,
                    CreatedAt = car.CreatedAt,
                    UpdatedAt = car.UpdatedAt
                },
                SellerId = auction.SellerId,
                WinnerId = auction.WinnerId,
                CreatedAt = auction.CreatedAt,
                UpdatedAt = auction.UpdatedAt
            };

            _logger.LogInformation("Auction created: {AuctionId} for car {CarId} ({Make} {Model})",
                auction.Id, car.Id, car.Make, car.Model);

            return ApiResponse<AuctionDto>.SuccessResponse(auctionDto, "Auction created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating auction");
            return ApiResponse<AuctionDto>.ErrorResponse(
                "An error occurred while creating the auction");
        }
    }

    public async Task<ApiResponse<AuctionDto>> UpdateAuctionAsync(UpdateAuctionDto updateAuctionDto)
    {
        try
        {
            var auction = await _auctionRepository.GetByIdAsync(updateAuctionDto.Id);

            if (auction == null)
            {
                return ApiResponse<AuctionDto>.ErrorResponse("Auction not found");
            }

            // Don't allow updates to active or completed auctions
            if (auction.Status == AuctionStatus.Active)
            {
                return ApiResponse<AuctionDto>.ErrorResponse(
                    "Cannot update an active auction");
            }

            if (auction.Status == AuctionStatus.Completed)
            {
                return ApiResponse<AuctionDto>.ErrorResponse(
                    "Cannot update a completed auction");
            }

            // Validate dates
            if (updateAuctionDto.StartTime >= updateAuctionDto.EndTime)
            {
                return ApiResponse<AuctionDto>.ErrorResponse(
                    "Start time must be before end time");
            }

            auction.Title = updateAuctionDto.Title;
            auction.Description = updateAuctionDto.Description;
            auction.StartingPrice = updateAuctionDto.StartingPrice;
            auction.ReservePrice = updateAuctionDto.ReservePrice;
            auction.StartTime = updateAuctionDto.StartTime;
            auction.EndTime = updateAuctionDto.EndTime;
            auction.UpdatedAt = DateTime.UtcNow;

            _auctionRepository.Update(auction);
            await _unitOfWork.SaveChangesAsync();

            var car = await _carRepository.GetByIdAsync(auction.CarId);

            var auctionDto = new AuctionDto
            {
                Id = auction.Id,
                Title = auction.Title,
                Description = auction.Description,
                StartingPrice = auction.StartingPrice,
                ReservePrice = auction.ReservePrice,
                CurrentPrice = auction.CurrentPrice,
                StartTime = auction.StartTime,
                EndTime = auction.EndTime,
                Status = auction.Status,
                CarId = auction.CarId,
                Car = car != null ? new CarDto
                {
                    Id = car.Id,
                    Make = car.Make,
                    Model = car.Model,
                    Year = car.Year,
                    VIN = car.VIN ?? string.Empty,
                    Mileage = car.Mileage,
                    Color = car.Color,
                    Description = car.Description,
                    ImageUrls = car.ImageUrls,
                    CreatedAt = car.CreatedAt,
                    UpdatedAt = car.UpdatedAt
                } : null,
                SellerId = auction.SellerId,
                WinnerId = auction.WinnerId,
                CreatedAt = auction.CreatedAt,
                UpdatedAt = auction.UpdatedAt
            };

            _logger.LogInformation("Auction updated: {AuctionId}", auction.Id);

            return ApiResponse<AuctionDto>.SuccessResponse(auctionDto, "Auction updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating auction {AuctionId}", updateAuctionDto.Id);
            return ApiResponse<AuctionDto>.ErrorResponse(
                "An error occurred while updating the auction");
        }
    }

    public async Task<ApiResponse<bool>> UpdateAuctionStatusAsync(int id, AuctionStatus status)
    {
        try
        {
            var auction = await _auctionRepository.GetByIdAsync(id);

            if (auction == null)
            {
                return ApiResponse<bool>.ErrorResponse("Auction not found");
            }

            auction.Status = status;
            auction.UpdatedAt = DateTime.UtcNow;

            _auctionRepository.Update(auction);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Auction {AuctionId} status changed to {Status}", id, status);

            return ApiResponse<bool>.SuccessResponse(true, $"Auction status updated to {status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating auction {AuctionId} status", id);
            return ApiResponse<bool>.ErrorResponse(
                "An error occurred while updating the auction status");
        }
    }

    public async Task<ApiResponse<bool>> DeleteAuctionAsync(int id)
    {
        try
        {
            var auction = await _auctionRepository.GetByIdAsync(id);

            if (auction == null)
            {
                return ApiResponse<bool>.ErrorResponse("Auction not found");
            }

            // Don't allow deletion of active or completed auctions
            if (auction.Status == AuctionStatus.Active)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Cannot delete an active auction. Cancel it first.");
            }

            if (auction.Status == AuctionStatus.Completed)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Cannot delete a completed auction");
            }

            _auctionRepository.Delete(auction);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Auction deleted: {AuctionId}", id);

            return ApiResponse<bool>.SuccessResponse(true, "Auction deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting auction {AuctionId}", id);
            return ApiResponse<bool>.ErrorResponse(
                "An error occurred while deleting the auction");
        }
    }
}
