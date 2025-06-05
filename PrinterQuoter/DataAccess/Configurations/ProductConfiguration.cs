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
        builder.Property(p => p.ImageUrl);

        builder.HasMany(p => p.UsedMaterials)
            .WithOne(um => um.Product)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Activities)
            .WithMany(p => p.Products);
    }
}
