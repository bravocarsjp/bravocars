using CarAuction.Application.DTOs.Bid;
using FluentValidation;

namespace CarAuction.Application.Validators;

public class PlaceBidDtoValidator : AbstractValidator<PlaceBidDto>
{
    public PlaceBidDtoValidator()
    {
        RuleFor(x => x.AuctionId)
            .GreaterThan(0).WithMessage("Invalid auction ID");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Bid amount must be greater than 0");
    }
}
