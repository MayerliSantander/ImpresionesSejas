using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class QuotationConfiguration: IEntityTypeConfiguration<Quotation>
{
    public void Configure(EntityTypeBuilder<Quotation> builder)
    {
        builder.ToTable("Quotations");

        builder.HasKey(q => q.Id);
        builder.Property(q => q.Id).ValueGeneratedOnAdd();

        builder.Property(q => q.QuotationNumber)
            .IsRequired();
        
        builder.Property(q => q.Date)
            .IsRequired();

        builder.Property(q => q.TotalPrice)
            .IsRequired();

        builder.Property(q => q.ValidityDays)
            .IsRequired();

        builder.Property(q => q.Status)
            .IsRequired();
        
        builder.Property(q => q.RequestedConfirmationDate)
            .IsRequired(false);
        
        builder.Property(q => q.DocumentPath)
            .IsRequired(false);

        builder.HasOne(q => q.User)
            .WithMany(q => q.Quotations)
            .HasForeignKey(q => q.UserId)
            .IsRequired();

        builder.HasOne(q => q.Order)
            .WithOne(p => p.Quotation)
            .HasForeignKey<Order>(q => q.QuotationId)
            .IsRequired(false);
        
        builder.HasMany(q => q.QuotationDetails)
            .WithOne(p => p.Quotation)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
