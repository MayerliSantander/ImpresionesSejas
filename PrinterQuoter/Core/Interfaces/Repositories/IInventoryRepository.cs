using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IInventoryRepository : IBaseRepository<Inventory>
{
    Task<Inventory> GetByMaterialIdAsync(Guid materialId);
    Task<bool> ValidateStockAsync(List<QuotationDetail> quotationDetails);
    Task AdjustStockAsync(List<StockAdjustmentDto> adjustments);
}
