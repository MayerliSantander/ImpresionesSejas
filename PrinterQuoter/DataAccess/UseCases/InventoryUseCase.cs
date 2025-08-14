using Core.Dtos;
using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class InventoryUseCase: BaseUseCase, IInventoryUseCase
{
    public InventoryUseCase(SqlContext context) : base(context) { }
    private IInventoryRepository _inventoryRepository;
    
    public IInventoryRepository GetInventoryRepository()
    {
        if (_inventoryRepository == null){
            _inventoryRepository = new InventoryRepository(_context);
        }
        return _inventoryRepository;
    }

    IInventoryRepository IInventoryUseCase.InventoryRepository => GetInventoryRepository();
}
