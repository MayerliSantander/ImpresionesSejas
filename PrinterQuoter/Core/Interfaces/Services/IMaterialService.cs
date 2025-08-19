using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Services;

public interface IMaterialService
{
    ValueTask<ShowMaterialDto> GetMaterialById(Guid id);
    Task<IEnumerable<ShowMaterialDto>> GetAllMaterials();
    Task<Material> CreateMaterial(MaterialDto materialDto);
    Task<Material> UpdateMaterial(Guid idMaterial, MaterialDto materialDto);
    Task DeleteMaterial(Guid materialId);
}
