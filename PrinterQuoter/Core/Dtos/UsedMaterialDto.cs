using Core.Entities;

namespace Core.Dtos;

public class UsedMaterialDto
{
    public Guid MaterialId { get; set; }
    public int Quantity { get; set; }
    
    public UsedMaterial CreateUsedMaterial()
    {
        UsedMaterial usedMaterial = new UsedMaterial();
        usedMaterial.Id = Guid.NewGuid();
        usedMaterial.MaterialId = MaterialId;
        usedMaterial.Quantity = Quantity;
        return usedMaterial;
    }
}
