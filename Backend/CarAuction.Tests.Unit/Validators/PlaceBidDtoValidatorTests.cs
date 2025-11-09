using CarAuction.Application.DTOs.Bid;
using CarAuction.Application.Validators;
using FluentAssertions;
using FluentValidation.TestHelper;

namespace CarAuction.Tests.Unit.Validators;

public class PlaceBidDtoValidatorTests
{
    private readonly PlaceBidDtoValidator _validator;

    public PlaceBidDtoValidatorTests()
    {
        _validator = new PlaceBidDtoValidator();
    }

    [Fact]
    public void Validate_WhenAuctionIdIsZero_ShouldHaveValidationError()
    {
        // Arrange
        var dto = new PlaceBidDto { AuctionId = 0, Amount = 10000 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.AuctionId)
            .WithErrorMessage("Invalid auction ID");
    }

    [Fact]
    public void Validate_WhenAuctionIdIsNegative_ShouldHaveValidationError()
    {
        // Arrange
        var dto = new PlaceBidDto { AuctionId = -1, Amount = 10000 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.AuctionId);
    }

    [Fact]
    public void Validate_WhenAmountIsZero_ShouldHaveValidationError()
    {
        // Arrange
        var dto = new PlaceBidDto { AuctionId = 1, Amount = 0 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Amount)
            .WithErrorMessage("Bid amount must be greater than 0");
    }

    [Fact]
    public void Validate_WhenAmountIsNegative_ShouldHaveValidationError()
    {
        // Arrange
        var dto = new PlaceBidDto { AuctionId = 1, Amount = -100 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Amount);
    }

    [Fact]
    public void Validate_WhenDtoIsValid_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var dto = new PlaceBidDto { AuctionId = 1, Amount = 10000 };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(1, 100)]
    [InlineData(5, 1000)]
    [InlineData(10, 50000)]
    [InlineData(999, 999999)]
    public void Validate_WithVariousValidInputs_ShouldNotHaveValidationErrors(int auctionId, decimal amount)
    {
        // Arrange
        var dto = new PlaceBidDto { AuctionId = auctionId, Amount = amount };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}
