using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class UsedMaterialConfiguration: IEntityTypeConfiguration<UsedMaterial>
{
    public void Configure(EntityTypeBuilder<UsedMaterial> builder)
    {
        builder.ToTable("UsedMaterials");
        builder.HasKey(um => um.Id);
        builder.Property(um => um.Quantity).IsRequired();
        builder.HasOne(um => um.Material)
            .WithMany(p => p.UsedMaterials)
            .HasForeignKey(um => um.MaterialId)
            .IsRequired();

        builder.HasOne(um => um.Product)
            .WithMany(p => p.UsedMaterials)
            .HasForeignKey(um => um.ProductId)
            .IsRequired();
    }
}
