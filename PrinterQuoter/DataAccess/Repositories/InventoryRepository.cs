using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class InventoryRepository: BaseRepository<Inventory>, IInventoryRepository
{
    private SqlContext _context;

    public InventoryRepository(SqlContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Inventory> GetByMaterialIdAsync(Guid materialId)
    {
        return await _context.Inventories
            .Include(i => i.Material)
            .Where(i => i.Material.Id == materialId)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ValidateStockAsync(List<QuotationDetail> quotationDetails)
    {
        foreach (var quotationDetail in quotationDetails)
        {
            var materialId= quotationDetail.Material.Id;
            foreach (var usedMaterial in quotationDetail.Product.UsedMaterials)
            {
                if (usedMaterial.MaterialId == materialId)
                {
                    var inventory = await GetByMaterialIdAsync(usedMaterial.MaterialId);
                    if (inventory == null || inventory.Quantity < ((usedMaterial.Quantity * quotationDetail.Quantity) / quotationDetail.Product.MinimumQuantity))
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
