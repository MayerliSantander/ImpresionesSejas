using Core.Entities;
using DataAccess.Configurations;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class SqlContext : DbContext
{
    public SqlContext(DbContextOptions<SqlContext> options)
        : base(options)
    { }
    
    public DbSet<Activity> Activities { get; set; }
    //public DbSet<Inventory> Inventories{ get; set; }
    public DbSet<Material> Materials { get; set; }
    //public DbSet<Order> Orders { get; set; }
    //public DbSet<Product> Products { get; set; }
    //public DbSet<Quotation> Quotations { get; set; }
    //public DbSet<UsedMaterial> UsedMaterials { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    //public SqlContext(DbContextOptions options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SqlContext).Assembly);
        modelBuilder.ApplyConfiguration(new MaterialConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new ActivityConfiguration());
        base.OnModelCreating(modelBuilder);
    }
}
