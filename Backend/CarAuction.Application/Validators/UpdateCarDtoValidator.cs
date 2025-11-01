using CarAuction.Application.DTOs.Car;
using FluentValidation;

namespace CarAuction.Application.Validators;

public class UpdateCarDtoValidator : AbstractValidator<UpdateCarDto>
{
    public UpdateCarDtoValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Invalid car ID");

        RuleFor(x => x.Make)
            .NotEmpty().WithMessage("Make is required")
            .MaximumLength(50).WithMessage("Make cannot exceed 50 characters");

        RuleFor(x => x.Model)
            .NotEmpty().WithMessage("Model is required")
            .MaximumLength(50).WithMessage("Model cannot exceed 50 characters");

        RuleFor(x => x.Year)
            .GreaterThan(1900).WithMessage("Year must be greater than 1900")
            .LessThanOrEqualTo(DateTime.Now.Year + 1).WithMessage($"Year cannot be greater than {DateTime.Now.Year + 1}");

        RuleFor(x => x.VIN)
            .NotEmpty().WithMessage("VIN is required")
            .Length(17).WithMessage("VIN must be exactly 17 characters")
            .Matches(@"^[A-HJ-NPR-Z0-9]{17}$").WithMessage("Invalid VIN format");

        RuleFor(x => x.Mileage)
            .GreaterThanOrEqualTo(0).WithMessage("Mileage cannot be negative");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("Color is required")
            .MaximumLength(30).WithMessage("Color cannot exceed 30 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.StartingPrice)
            .GreaterThan(0).WithMessage("Starting price must be greater than 0");

        RuleFor(x => x.ReservePrice)
            .GreaterThan(x => x.StartingPrice).WithMessage("Reserve price must be greater than starting price")
            .When(x => x.ReservePrice.HasValue);
    }
}
