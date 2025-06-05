using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class ProductUseCase: BaseUseCase, IProductUseCase
{
    public ProductUseCase(SqlContext context) : base(context) { }
    private IProductRepository _productRepository;
    private IMaterialRepository _materialRepository;
    private IActivityRepository _activityRepository;
    private IUsedMaterialRepository _usedMaterialRepository;

    public IProductRepository GetProductRepository()
    {
        if (_productRepository == null)
        {
            _productRepository = new ProductRepository(_context);
        }

        return _productRepository;
    }
    public IMaterialRepository GetMaterialRepository()
    {
        if (_materialRepository == null)
        {
            _materialRepository = new MaterialRepository(_context);
        }

        return _materialRepository;
    }
    public IActivityRepository GetActivityRepository()
    {
        if (_activityRepository == null)
        {
            _activityRepository = new ActivityRepository(_context);
        }

        return _activityRepository;
    }
    public IUsedMaterialRepository GetUsedMaterialRepository()
    {
        if (_usedMaterialRepository == null)
        {
            _usedMaterialRepository = new UsedMaterialRepository(_context);
        }

        return _usedMaterialRepository;
    }
    IProductRepository IProductUseCase.ProductRepository => GetProductRepository();
    IMaterialRepository IProductUseCase.MaterialRepository => GetMaterialRepository();
    IActivityRepository IProductUseCase.ActivityRepository => GetActivityRepository();
    IUsedMaterialRepository IProductUseCase.UsedMaterialRepository => GetUsedMaterialRepository();
}
