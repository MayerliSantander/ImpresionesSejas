namespace Core.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string ProductName { get; set; }
    public int MinimumQuantity { get; set; }
    public string Category { get; set; }
    public ICollection<string> ImageUrls { get; set; }
    public string SizeInCm { get; set; }
    public string Description { get; set; }
    public ICollection<UsedMaterial> UsedMaterials { get; set; }
    public ICollection<Activity> Activities { get; set; }
}
