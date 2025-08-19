using Core.Dtos;

namespace Core.Interfaces.Services;

public interface IInventoryService
{
    Task<InventoryDto> GetInventoryByMaterialIdAsync(Guid materialId);
    Task<InventoryDto> UpdateInventoryQuantityAsync(Guid materialId, int quantity);
    Task<InventoryDto> CreateInventoryAsync(Guid materialId, int initialQuantity);
}
