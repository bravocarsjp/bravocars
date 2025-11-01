using CarAuction.Application.DTOs.Auction;
using FluentValidation;

namespace CarAuction.Application.Validators;

public class CreateAuctionDtoValidator : AbstractValidator<CreateAuctionDto>
{
    public CreateAuctionDtoValidator()
    {
        RuleFor(x => x.CarId)
            .GreaterThan(0).WithMessage("Invalid car ID");

        RuleFor(x => x.StartTime)
            .GreaterThanOrEqualTo(DateTime.UtcNow).WithMessage("Start time cannot be in the past");

        RuleFor(x => x.EndTime)
            .GreaterThan(x => x.StartTime).WithMessage("End time must be after start time")
            .Must((dto, endTime) => (endTime - dto.StartTime).TotalHours >= 1)
            .WithMessage("Auction must be at least 1 hour long");
    }
}
