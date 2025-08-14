using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasIndex(p => p.Id);
        builder.Property(p => p.Id).ValueGeneratedOnAdd();

        builder.Property(p => p.ConfirmationDate);
        builder.Property(p => p.DeliveryDate);
        
        builder.HasOne(q => q.Quotation)
            .WithOne(p => p.Order)
            .HasForeignKey<Order>(q => q.QuotationId)
            .IsRequired();
    }
}
