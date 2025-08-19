using Core.Dtos;
using Core.Entities;
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
    
    public async Task<InventoryDto> CreateInventoryAsync(Guid materialId, int initialQuantity)
    {
        if (initialQuantity < 0)
        {
            throw new InvalidOperationException("La cantidad inicial no puede ser negativa.");
        }

        var existing = await _inventoryUseCase.InventoryRepository.GetByMaterialIdAsync(materialId);
        if (existing != null)
        {
            throw new InvalidOperationException("El inventario para este material ya existe.");
        }

        var inv = new Inventory
        {
            MaterialId = materialId,
            Quantity = initialQuantity
        };

        await _inventoryUseCase.InventoryRepository.Add(inv);
        await _inventoryUseCase.Commitment();

        var created = await _inventoryUseCase.InventoryRepository.GetByMaterialIdAsync(materialId);
        if (created == null)
        {
            throw new InvalidOperationException("No se pudo crear el inventario.");
        }
        
        return InventoryDto.FromEntity(created);
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
