using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class UserConfiguration: IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasIndex(p => p.Id);
        builder.Property(p => p.Id).ValueGeneratedOnAdd();

        builder.Property(p => p.Email);
        builder.Property(p => p.UserName);
        builder.Property(p => p.Phone);
        //builder.Property(p => p.Quotations);
        builder.HasMany(p => p.Roles)
            .WithMany(e => e.Users);
    }
}
