using Core.Dtos;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class InventoryService: IInventoryService
{
    private readonly IInventoryUseCase _inventoryUseCase;

    public InventoryService(IInventoryUseCase inventoryUseCase)
    {
        _inventoryUseCase = inventoryUseCase;
    }

    public async Task<InventoryDto> GetInventoryByMaterialIdAsync(Guid materialId)
    {
        var inventory = await _inventoryUseCase.InventoryRepository.GetByMaterialIdAsync(materialId);
        if (inventory == null)
        {
            throw new InvalidOperationException("Material no encontrado en inventario.");
        }
        return InventoryDto.FromEntity(inventory);
    }
    
    public async Task<InventoryDto> UpdateInventoryQuantityAsync(Guid materialId, int quantity)
    {
        var inventory = await _inventoryUseCase.InventoryRepository.GetByMaterialIdAsync(materialId);
        if (inventory == null)
        {
            throw new InvalidOperationException("Material no encontrado en inventario.");
        }

        inventory.Quantity = quantity;

        await _inventoryUseCase.InventoryRepository.Update(inventory);
        await _inventoryUseCase.Commitment();

        return InventoryDto.FromEntity(inventory);
    }
}
