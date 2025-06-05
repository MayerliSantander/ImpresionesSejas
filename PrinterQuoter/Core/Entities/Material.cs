namespace Core.Entities;

public class Material
{
    public Guid Id { get; set; }
    public string MaterialName { get; set; }
    public string Size { get; set; }
    public string Type { get; set; }
    public double MaterialPrice { get; set; }
    public ICollection<UsedMaterial> UsedMaterials { get; set; }
}
