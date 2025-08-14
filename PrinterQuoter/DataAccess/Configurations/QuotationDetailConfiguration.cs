using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class QuotationDetailConfiguration : IEntityTypeConfiguration<QuotationDetail>
{
    public void Configure(EntityTypeBuilder<QuotationDetail> builder)
    {
        builder.ToTable("QuotationDetails");

        builder.HasKey(q => q.Id);
        builder.Property(q => q.Id).ValueGeneratedOnAdd();
     
        builder.Property(q => q.Quantity)
            .IsRequired();

        builder.Property(q => q.Price)
            .IsRequired();

        builder.HasOne(q => q.Quotation)
            .WithMany(p => p.QuotationDetails)
            .HasForeignKey(q => q.QuotationId)
            .IsRequired();
        
        builder.HasOne(q => q.Product)
            .WithMany(p => p.QuotationDetails)
            .HasForeignKey(q => q.ProductId)
            .IsRequired();
        
        builder.HasOne(q => q.Material)
            .WithMany(p => p.QuotationDetails)
            .HasForeignKey(q => q.MaterialId)
            .IsRequired();

        builder.HasMany(q => q.Activities)
            .WithMany(p => p.QuotationDetails);
    }
}
