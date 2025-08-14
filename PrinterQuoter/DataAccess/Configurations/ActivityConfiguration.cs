using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class ActivityConfiguration: IEntityTypeConfiguration<Activity>
{
    public void Configure(EntityTypeBuilder<Activity> builder)
    {
        builder.ToTable("Activities");

        builder.HasIndex(p => p.Id);
        builder.Property(p => p.Id).ValueGeneratedOnAdd();
        builder.Property(p => p.ActivityName).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Price).IsRequired();
        
        builder.HasMany(p => p.Products)
            .WithMany(p => p.Activities);

        builder.HasMany(q => q.QuotationDetails)
            .WithMany(q => q.Activities);
    }
}
