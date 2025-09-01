using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IProductRepository : IBaseRepository<Product>
{
    Task<IEnumerable<Product>> GetProductsByCategory(string category);
    Task<List<Product>> GetByIdsAsync(IEnumerable<Guid> ids);
}
