using CarAuction.Application.DTOs.Auction;
using CarAuction.Application.Interfaces.Services;
using CarAuction.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarAuction.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuctionsController : ControllerBase
{
    private readonly IAuctionService _auctionService;
    private readonly ILogger<AuctionsController> _logger;

    public AuctionsController(IAuctionService auctionService, ILogger<AuctionsController> logger)
    {
        _auctionService = auctionService;
        _logger = logger;
    }

    /// <summary>
    /// Get all auctions with pagination and optional status filter
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <param name="status">Optional status filter (Draft, Scheduled, Active, Completed, Cancelled)</param>
    /// <returns>Paginated list of auctions</returns>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAuctions(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] AuctionStatus? status = null)
    {
        var result = await _auctionService.GetAllAuctionsAsync(pageNumber, pageSize, status);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get an auction by ID
    /// </summary>
    /// <param name="id">Auction ID</param>
    /// <returns>Auction details with car information</returns>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAuctionById(int id)
    {
        var result = await _auctionService.GetAuctionByIdAsync(id);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Create a new auction (Admin only)
    /// </summary>
    /// <param name="createAuctionDto">Auction creation data</param>
    /// <returns>Created auction</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateAuction([FromBody] CreateAuctionDto createAuctionDto)
    {
        var result = await _auctionService.CreateAuctionAsync(createAuctionDto);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetAuctionById), new { id = result.Data!.Id }, result);
    }

    /// <summary>
    /// Update an existing auction (Admin only)
    /// </summary>
    /// <param name="id">Auction ID</param>
    /// <param name="updateAuctionDto">Auction update data</param>
    /// <returns>Updated auction</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateAuction(int id, [FromBody] UpdateAuctionDto updateAuctionDto)
    {
        if (id != updateAuctionDto.Id)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        var result = await _auctionService.UpdateAuctionAsync(updateAuctionDto);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Update auction status (Admin only)
    /// </summary>
    /// <param name="id">Auction ID</param>
    /// <param name="status">New status</param>
    /// <returns>Success or error response</returns>
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateAuctionStatus(int id, [FromBody] AuctionStatus status)
    {
        var result = await _auctionService.UpdateAuctionStatusAsync(id, status);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Delete an auction (Admin only)
    /// </summary>
    /// <param name="id">Auction ID</param>
    /// <returns>Success or error response</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteAuction(int id)
    {
        var result = await _auctionService.DeleteAuctionAsync(id);

        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true)
            {
                return NotFound(result);
            }
            return BadRequest(result);
        }

        return Ok(result);
    }
}
