using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class ProductConfiguration: IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.ProductName).IsRequired();
        builder.Property(p => p.MinimumQuantity).IsRequired();
        builder.Property(p => p.Category).IsRequired();
        builder.Property(p => p.SizeInCm).IsRequired(); 
        builder.Property(p => p.Description).IsRequired(); 
        builder.Property(p => p.ImageUrls)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );

        builder.HasMany(p => p.UsedMaterials)
            .WithOne(um => um.Product)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Activities)
            .WithMany(p => p.Products);
    }
}
