using Core.Entities;

namespace Core.Dtos;

public class MaterialDto
{
    public string MaterialName { get; set; }
    public string Size { get; set; }
    public string Type { get; set; }
    public double MaterialPrice { get; set; }

    public Material CreateMaterial()
    {
        Material material = new Material();
        material.Id = Guid.NewGuid();
        material.MaterialName = MaterialName;
        material.Size = Size;
        material.Type = Type;
        material.MaterialPrice = MaterialPrice;
        material.UsedMaterials = new List<UsedMaterial>();
        return material;
    }
}