using CarAuction.Application.DTOs.Car;
using CarAuction.Application.DTOs.Common;
using CarAuction.Application.Interfaces.Repositories;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CarAuction.Infrastructure.Services.Cars;

public class CarService : ICarService
{
    private readonly ICarRepository _carRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CarService> _logger;

    public CarService(
        ICarRepository carRepository,
        IUnitOfWork unitOfWork,
        ILogger<CarService> logger)
    {
        _carRepository = carRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ApiResponse<PaginatedResult<CarDto>>> GetAllCarsAsync(int pageNumber, int pageSize)
    {
        try
        {
            var (cars, totalCount) = await _carRepository.GetPagedAsync(
                pageNumber,
                pageSize,
                orderBy: c => c.Year,
                ascending: false);

            var carDtos = cars.Select(c => new CarDto
            {
                Id = c.Id,
                Make = c.Make,
                Model = c.Model,
                Year = c.Year,
                VIN = c.VIN ?? string.Empty,
                Mileage = c.Mileage,
                Color = c.Color,
                Description = c.Description,
                ImageUrls = c.ImageUrls,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList();

            var paginatedResult = new PaginatedResult<CarDto>
            {
                Items = carDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            _logger.LogInformation("Retrieved {Count} cars (page {Page}/{TotalPages})",
                carDtos.Count, pageNumber, paginatedResult.TotalPages);

            return ApiResponse<PaginatedResult<CarDto>>.SuccessResponse(paginatedResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cars");
            return ApiResponse<PaginatedResult<CarDto>>.ErrorResponse(
                "An error occurred while retrieving cars");
        }
    }

    public async Task<ApiResponse<CarDto>> GetCarByIdAsync(int id)
    {
        try
        {
            var car = await _carRepository.GetByIdAsync(id);

            if (car == null)
            {
                return ApiResponse<CarDto>.ErrorResponse("Car not found");
            }

            var carDto = new CarDto
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
            };

            return ApiResponse<CarDto>.SuccessResponse(carDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving car {CarId}", id);
            return ApiResponse<CarDto>.ErrorResponse(
                "An error occurred while retrieving the car");
        }
    }

    public async Task<ApiResponse<CarDto>> CreateCarAsync(CreateCarDto createCarDto)
    {
        try
        {
            // Check if VIN already exists
            if (!string.IsNullOrEmpty(createCarDto.VIN))
            {
                var isUnique = await _carRepository.IsVINUniqueAsync(createCarDto.VIN);
                if (!isUnique)
                {
                    return ApiResponse<CarDto>.ErrorResponse(
                        $"A car with VIN '{createCarDto.VIN}' already exists");
                }
            }

            var car = new Car
            {
                Make = createCarDto.Make,
                Model = createCarDto.Model,
                Year = createCarDto.Year,
                VIN = createCarDto.VIN,
                Mileage = createCarDto.Mileage,
                Color = createCarDto.Color,
                Description = createCarDto.Description,
                ImageUrls = createCarDto.ImageUrls ?? new List<string>(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _carRepository.AddAsync(car);
            await _unitOfWork.SaveChangesAsync();

            var carDto = new CarDto
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
            };

            _logger.LogInformation("Car created: {CarId} - {Make} {Model} ({VIN})",
                car.Id, car.Make, car.Model, car.VIN);

            return ApiResponse<CarDto>.SuccessResponse(carDto, "Car created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating car");
            return ApiResponse<CarDto>.ErrorResponse(
                "An error occurred while creating the car");
        }
    }

    public async Task<ApiResponse<CarDto>> UpdateCarAsync(UpdateCarDto updateCarDto)
    {
        try
        {
            var car = await _carRepository.GetByIdAsync(updateCarDto.Id);

            if (car == null)
            {
                return ApiResponse<CarDto>.ErrorResponse("Car not found");
            }

            // Check if VIN changed and if new VIN is unique
            if (!string.IsNullOrEmpty(updateCarDto.VIN) && car.VIN != updateCarDto.VIN)
            {
                var isUnique = await _carRepository.IsVINUniqueAsync(updateCarDto.VIN, updateCarDto.Id);
                if (!isUnique)
                {
                    return ApiResponse<CarDto>.ErrorResponse(
                        $"A car with VIN '{updateCarDto.VIN}' already exists");
                }
            }

            car.Make = updateCarDto.Make;
            car.Model = updateCarDto.Model;
            car.Year = updateCarDto.Year;
            car.VIN = updateCarDto.VIN;
            car.Mileage = updateCarDto.Mileage;
            car.Color = updateCarDto.Color;
            car.Description = updateCarDto.Description;
            car.ImageUrls = updateCarDto.ImageUrls ?? car.ImageUrls;
            car.UpdatedAt = DateTime.UtcNow;

            _carRepository.Update(car);
            await _unitOfWork.SaveChangesAsync();

            var carDto = new CarDto
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
            };

            _logger.LogInformation("Car updated: {CarId} - {Make} {Model}", car.Id, car.Make, car.Model);

            return ApiResponse<CarDto>.SuccessResponse(carDto, "Car updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating car {CarId}", updateCarDto.Id);
            return ApiResponse<CarDto>.ErrorResponse(
                "An error occurred while updating the car");
        }
    }

    public async Task<ApiResponse<bool>> DeleteCarAsync(int id)
    {
        try
        {
            var car = await _carRepository.GetByIdAsync(id);

            if (car == null)
            {
                return ApiResponse<bool>.ErrorResponse("Car not found");
            }

            // TODO: Check if car has any auctions

            _carRepository.Delete(car);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Car deleted: {CarId} - {Make} {Model}", id, car.Make, car.Model);

            return ApiResponse<bool>.SuccessResponse(true, "Car deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting car {CarId}", id);
            return ApiResponse<bool>.ErrorResponse(
                "An error occurred while deleting the car");
        }
    }
}
