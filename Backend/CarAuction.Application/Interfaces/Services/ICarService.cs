using CarAuction.Application.DTOs.Car;
using CarAuction.Application.DTOs.Common;

namespace CarAuction.Application.Interfaces.Services;

public interface ICarService
{
    Task<ApiResponse<PaginatedResult<CarDto>>> GetAllCarsAsync(int pageNumber, int pageSize);
    Task<ApiResponse<CarDto>> GetCarByIdAsync(int id);
    Task<ApiResponse<CarDto>> CreateCarAsync(CreateCarDto createCarDto);
    Task<ApiResponse<CarDto>> UpdateCarAsync(UpdateCarDto updateCarDto);
    Task<ApiResponse<bool>> DeleteCarAsync(int id);
}
