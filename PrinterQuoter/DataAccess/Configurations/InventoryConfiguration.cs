using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class InventoryConfiguration: IEntityTypeConfiguration<Inventory>
{
    public void Configure(EntityTypeBuilder<Inventory> builder)
    {
        builder.ToTable("Inventories");

        builder.HasKey(i => i.Id);
        builder.Property(i => i.Id).ValueGeneratedOnAdd();

        builder.HasOne(i => i.Material)
            .WithMany()
            .HasForeignKey(i => i.MaterialId)
            .IsRequired();

        builder.Property(i => i.Quantity)
            .IsRequired();
    }
}
