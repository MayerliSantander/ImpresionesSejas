using Core.Dtos;

namespace Core.Interfaces.Services;

public interface IInventoryService
{
    Task<InventoryDto> GetInventoryByMaterialIdAsync(Guid materialId);
}
