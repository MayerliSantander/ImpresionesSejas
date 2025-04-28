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

    public async ValueTask<Material> GetMaterialById(Guid id)
    {
        return await _materialUseCase.MaterialRepository.GetById(id);
    }

    public async Task<IEnumerable<Material>> GetAllMaterials()
    {
        return await _materialUseCase.MaterialRepository.GetAll();
    }

    public async Task<Material> CreateMaterial(MaterialDto materialDto)
    {
        Material material = materialDto.CreateMaterial();
        await _materialUseCase.MaterialRepository.Add(material);
        await _materialUseCase.Commitment();
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
