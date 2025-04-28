using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations
{
	public class MaterialConfiguration : IEntityTypeConfiguration<Material>
	{
		public void Configure(EntityTypeBuilder<Material> builder)
		{
			builder.ToTable("Materials");

			builder.HasIndex(p => p.Id);
			builder.Property(p => p.Id).ValueGeneratedOnAdd();

			builder.Property(p => p.MaterialName);
			builder.Property(p => p.Size);
			builder.Property(p => p.Type);
			builder.Property(p => p.MaterialPrice);
		}
	}
}
