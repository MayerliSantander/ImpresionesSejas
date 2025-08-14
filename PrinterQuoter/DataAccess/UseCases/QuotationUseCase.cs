using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class QuotationUseCase : BaseUseCase, IQuotationUseCase
{
    public QuotationUseCase(SqlContext context) : base(context) { }
    private IQuotationRepository _quotationRepository;
    private IInventoryRepository _inventoryRepository;
    private IQuotationDetailRepository _quotationDetailRepository;
    private IUserRepository _userRepository;
    private IActivityRepository _activityRepository;
    private IProductRepository _productRepository;
    private IMaterialRepository _materialRepository;
    public IQuotationRepository GetQuotationRepository()
    {
        if (_quotationRepository == null){
            _quotationRepository = new QuotationRepository(_context);
        }
        return _quotationRepository;
    }
    
    public IInventoryRepository GetInventoryRepository()
    {
        if (_inventoryRepository == null){
            _inventoryRepository = new InventoryRepository(_context);
        }
        return _inventoryRepository;
    }

    public IQuotationDetailRepository GetQuotationDetailRepository()
    {
        if (_quotationDetailRepository == null){
            _quotationDetailRepository = new QuotationDetailRepository(_context);
        }
        return _quotationDetailRepository;
    }

    public IUserRepository GetUserRepository()
    {
        if (_userRepository == null){
            _userRepository = new UserRepository(_context);
        }
        return _userRepository;
    }

    public IActivityRepository GetActivityRepository()
    {
        if (_activityRepository == null){
            _activityRepository = new ActivityRepository(_context);
        }
        return _activityRepository;
    }

    public IProductRepository GetProductRepository()
    {
        if (_productRepository == null){
            _productRepository = new ProductRepository(_context);
        }
        return _productRepository;
    }

    public IMaterialRepository GetMaterialRepository()
    {
        if (_materialRepository == null){
            _materialRepository = new MaterialRepository(_context);
        }
        return _materialRepository;
    }
    
    IQuotationRepository IQuotationUseCase.QuotationRepository => GetQuotationRepository();
    IInventoryRepository IQuotationUseCase.InventoryRepository => GetInventoryRepository();
    IQuotationDetailRepository IQuotationUseCase.QuotationDetailRepository => GetQuotationDetailRepository();
    IUserRepository IQuotationUseCase.UserRepository => GetUserRepository();
    IActivityRepository IQuotationUseCase.ActivityRepository => GetActivityRepository();
    IProductRepository IQuotationUseCase.ProductRepository => GetProductRepository();
    IMaterialRepository IQuotationUseCase.MaterialRepository => GetMaterialRepository();
}
