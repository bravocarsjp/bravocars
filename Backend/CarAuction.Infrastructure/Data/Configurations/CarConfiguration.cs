using CarAuction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarAuction.Infrastructure.Data.Configurations;

public class CarConfiguration : IEntityTypeConfiguration<Car>
{
    public void Configure(EntityTypeBuilder<Car> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Make)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Model)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Year)
            .IsRequired();

        builder.Property(c => c.VIN)
            .HasMaxLength(17);

        builder.Property(c => c.Color)
            .HasMaxLength(50);

        builder.Property(c => c.Description)
            .HasMaxLength(2000);

        // Store ImageUrls as JSON
        builder.Property(c => c.ImageUrls)
            .HasColumnType("jsonb");

        builder.HasIndex(c => c.VIN)
            .IsUnique()
            .HasFilter("\"VIN\" IS NOT NULL");
    }
}
