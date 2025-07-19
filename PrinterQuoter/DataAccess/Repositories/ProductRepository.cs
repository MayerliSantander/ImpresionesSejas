using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class ProductRepository: BaseRepository<Product>, IProductRepository
{
    private SqlContext _context;

    public ProductRepository(SqlContext context) : base(context)
    {
        _context = context;
    }
    
    public override async Task<IEnumerable<Product>> GetAll()
    {
        return await _context.Products
            .Include(p => p.UsedMaterials)
            .Include(p => p.Activities)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsByCategory(string category)
    {
        return await _context.Products
            .Where(p => p.Category.ToLower() == category.ToLower())
            .Include(p => p.UsedMaterials)
            .Include(p => p.Activities)
            .ToListAsync();
    }
    
    public override async ValueTask<Product> GetById(Guid id)
    {
        return await _context.Products
            .Include(p => p.UsedMaterials)
            .Include(p => p.Activities)
            .FirstOrDefaultAsync(p => p.Id == id) ?? throw new InvalidOperationException();
    }
}
