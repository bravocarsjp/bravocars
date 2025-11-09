using CarAuction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarAuction.Infrastructure.Data.Configurations;

public class AuctionConfiguration : IEntityTypeConfiguration<Auction>
{
    public void Configure(EntityTypeBuilder<Auction> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Description)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(a => a.StartingPrice)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(a => a.ReservePrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(a => a.CurrentPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(a => a.Status)
            .IsRequired()
            .HasConversion<string>();

        // Relationships
        builder.HasOne(a => a.Car)
            .WithOne(c => c.Auction)
            .HasForeignKey<Auction>(a => a.CarId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Seller)
            .WithMany(u => u.Auctions)
            .HasForeignKey(a => a.SellerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Winner)
            .WithMany()
            .HasForeignKey(a => a.WinnerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(a => a.Bids)
            .WithOne(b => b.Auction)
            .HasForeignKey(b => b.AuctionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(a => a.Status);
        builder.HasIndex(a => a.StartTime);
        builder.HasIndex(a => a.EndTime);
        builder.HasIndex(a => a.SellerId);
    }
}
