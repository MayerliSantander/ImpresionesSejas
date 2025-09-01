using Core.Dtos;
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
            .Where(i => i.MaterialId == materialId)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ValidateStockAsync(List<QuotationDetail> quotationDetails)
    {
        foreach (var quotationDetail in quotationDetails)
        {
            var materialId = quotationDetail.MaterialId;

            if (quotationDetail.Product?.UsedMaterials == null || materialId == Guid.Empty)
            { 
                continue;
            }

            var um = quotationDetail.Product.UsedMaterials.FirstOrDefault(x => x.MaterialId == materialId);
            if (um == null)
            {
                continue;
            }

            var required = (int)Math.Ceiling(
                (decimal)um.Quantity * quotationDetail.Quantity / Math.Max(1, quotationDetail.Product.MinimumQuantity)
            );
            
            var inventory = await GetByMaterialIdAsync(um.MaterialId);

            if (inventory == null || inventory.Quantity < required) 
            {
                return false;
            }
        }
        return true;
    }
    
    public async Task AdjustStockAsync(List<StockAdjustmentDto> adjustments)
    {
        if (adjustments == null || adjustments.Count == 0) return;

        var ids = adjustments.Select(a => a.MaterialId).Distinct().ToList();

        var inventories = await _context.Inventories
            .Where(i => ids.Contains(i.MaterialId))
            .ToListAsync();

        foreach (var adj in adjustments)
        {
            if (adj.QuantityToDeduct < 0)
                throw new InvalidOperationException("La cantidad a descontar no puede ser negativa.");

            var inv = inventories.FirstOrDefault(i => i.MaterialId == adj.MaterialId);
            if (inv == null)
                throw new InvalidOperationException($"Material {adj.MaterialId} no encontrado en inventario.");

            if (inv.Quantity < adj.QuantityToDeduct)
                throw new InvalidOperationException("No hay suficiente stock para los productos seleccionados.");
        }

        foreach (var adj in adjustments)
        {
            var inv = inventories.First(i => i.MaterialId == adj.MaterialId);
            inv.Quantity -= adj.QuantityToDeduct;
            _context.Inventories.Update(inv);
        }
    }
    
    public async Task<int> CountBelowOrEqualAsync(int threshold)
    {
        return await _context.Inventories
            .CountAsync(i => i.Quantity <= threshold);
    }
}
