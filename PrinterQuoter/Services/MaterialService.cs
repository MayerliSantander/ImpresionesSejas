using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class MaterialService : IMaterialService
{
    private readonly IMaterialUseCase _materialUseCase;

    public MaterialService(IMaterialUseCase materialUseCase)
    {
        _materialUseCase = materialUseCase;
    }

    public async ValueTask<ShowMaterialDto> GetMaterialById(Guid id)
    {
        var material = await _materialUseCase.MaterialRepository.GetById(id);
        if (material == null)
            throw new InvalidOperationException("Material no encontrado.");

        var inventory = await _materialUseCase.InventoryRepository.GetByMaterialIdAsync(id);

        return new ShowMaterialDto()
        {
            Id = material.Id,
            MaterialName = material.MaterialName,
            Size = material.Size,
            Type = material.Type,
            MaterialPrice = material.MaterialPrice,
            InventoryQuantity = inventory?.Quantity ?? 0
        };
    }

    public async Task<IEnumerable<ShowMaterialDto>> GetAllMaterials()
    {
        var materials = await _materialUseCase.MaterialRepository.GetAll();
        var inventories = await _materialUseCase.InventoryRepository.GetAll();

        var invByMaterial = inventories
            .ToDictionary(i => i.MaterialId, i => i.Quantity);

        var result = materials.Select(m => new ShowMaterialDto()
        {
            Id = m.Id,
            MaterialName = m.MaterialName,
            Size = m.Size,
            Type = m.Type,
            MaterialPrice = m.MaterialPrice,
            InventoryQuantity = invByMaterial.TryGetValue(m.Id, out var q) ? q : 0
        });

        return result;
    }

    public async Task<Material> CreateMaterial(MaterialDto materialDto)
    {
        Material material = materialDto.CreateMaterial();
        await _materialUseCase.MaterialRepository.Add(material);
        await _materialUseCase.Commitment();

        var existingInv = await _materialUseCase.InventoryRepository.GetByMaterialIdAsync(material.Id);
        if (existingInv == null)
        {
            var inv = new Inventory
            {
                MaterialId = material.Id,
                Quantity = materialDto.InitialQuantity ?? 0
            };
            await _materialUseCase.InventoryRepository.Add(inv);
            await _materialUseCase.Commitment();
        }
        
        return material;
    }

    public async Task<Material> UpdateMaterial(Guid idMaterial, MaterialDto materialDto)
    {
        Material material = materialDto.CreateMaterial();
        material.Id = idMaterial;
        Material materialToUpdate = await _materialUseCase.MaterialRepository.GetById(material.Id);
        if (material.MaterialName != null && material.MaterialName != "")
        {
            materialToUpdate.MaterialName = material.MaterialName;
        }
        if (material.Size != null && material.Size != "")
        {
            materialToUpdate.Size = material.Size;
        }
        if (material.Type != null && material.Type != "")
        {
            materialToUpdate.Type = material.Type;
        }
        if (material.MaterialPrice != null && material.MaterialPrice > 0)
        {
            materialToUpdate.MaterialPrice = material.MaterialPrice;
        }
        await _materialUseCase.MaterialRepository.Update(materialToUpdate);
        await _materialUseCase.Commitment();
        return material;
    }

    public async Task DeleteMaterial(Guid materialId)
    {
        Material materialToDelete = await _materialUseCase.MaterialRepository.GetById(materialId);
        _materialUseCase.MaterialRepository.Remove(materialToDelete);
        await _materialUseCase.Commitment();
    }
}
