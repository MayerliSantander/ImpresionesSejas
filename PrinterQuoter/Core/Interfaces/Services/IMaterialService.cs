using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Services;

public interface IMaterialService
{
    ValueTask<Material> GetMaterialById(Guid id);
    Task<IEnumerable<Material>> GetAllMaterials();
    Task<Material> CreateMaterial(MaterialDto materialDto);
    Task<Material> UpdateMaterial(Guid idMaterial, MaterialDto materialDto);
    Task DeleteMaterial(Guid materialId);
}
