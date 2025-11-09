using System.Security.Claims;
using CarAuction.Application.DTOs.Bid;
using CarAuction.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarAuction.API.Controllers;

[Authorize]
[ApiController]
[Route("api/auctions/{auctionId}/[controller]")]
public class BidsController : ControllerBase
{
    private readonly IBidService _bidService;
    private readonly ILogger<BidsController> _logger;

    public BidsController(IBidService bidService, ILogger<BidsController> logger)
    {
        _bidService = bidService;
        _logger = logger;
    }

    /// <summary>
    /// Get all bids for an auction
    /// </summary>
    /// <param name="auctionId">Auction ID</param>
    /// <returns>List of bids for the auction</returns>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBidsByAuctionId(int auctionId)
    {
        var result = await _bidService.GetBidsByAuctionIdAsync(auctionId);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get the highest bid for an auction
    /// </summary>
    /// <param name="auctionId">Auction ID</param>
    /// <returns>Highest bid</returns>
    [HttpGet("highest")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHighestBid(int auctionId)
    {
        var result = await _bidService.GetHighestBidAsync(auctionId);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Place a bid on an auction
    /// </summary>
    /// <param name="auctionId">Auction ID</param>
    /// <param name="placeBidDto">Bid placement data</param>
    /// <returns>Created bid</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> PlaceBid(int auctionId, [FromBody] PlaceBidDto placeBidDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        if (auctionId != placeBidDto.AuctionId)
        {
            return BadRequest(new { message = "Auction ID mismatch" });
        }

        var result = await _bidService.PlaceBidAsync(userId, placeBidDto);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(
            nameof(GetBidsByAuctionId),
            new { auctionId = placeBidDto.AuctionId },
            result);
    }
}

/// <summary>
/// User bids controller - for getting current user's bids
/// </summary>
[Authorize]
[ApiController]
[Route("api/users/me/[controller]")]
public class MyBidsController : ControllerBase
{
    private readonly IBidService _bidService;
    private readonly ILogger<MyBidsController> _logger;

    public MyBidsController(IBidService bidService, ILogger<MyBidsController> logger)
    {
        _bidService = bidService;
        _logger = logger;
    }

    /// <summary>
    /// Get all bids for the current authenticated user
    /// </summary>
    /// <returns>List of user's bids</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyBids()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var result = await _bidService.GetBidsByUserIdAsync(userId);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
