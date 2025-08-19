using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class MaterialUseCase : BaseUseCase, IMaterialUseCase
{
    public MaterialUseCase(SqlContext context) : base(context) { }
    private IMaterialRepository _materialRepository;
    private IInventoryRepository _inventoryRepository;

    public IMaterialRepository GetMaterialRepository()
    {
        if (_materialRepository == null){
            _materialRepository = new MaterialRepository(_context);
        }
        return _materialRepository;
    }
    
    public IInventoryRepository GetInventoryRepository()
    {
        if (_inventoryRepository == null){
            _inventoryRepository = new InventoryRepository(_context);
        }
        return _inventoryRepository;
    }

    IMaterialRepository IMaterialUseCase.MaterialRepository => GetMaterialRepository();
    IInventoryRepository IMaterialUseCase.InventoryRepository => GetInventoryRepository();
}
