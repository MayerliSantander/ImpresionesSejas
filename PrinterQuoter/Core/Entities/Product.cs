namespace Core.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string ProductName { get; set; }
    public ICollection<UsedMaterial> UsedMaterials { get; set; }
    public int MinimumQuantity { get; set; }
    public ICollection<Activity> Activities { get; set; }
}
