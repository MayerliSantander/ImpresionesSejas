using Core.Entities;

namespace Core.Dtos;

public class ShowMaterialDto
{
    public Guid Id { get; set; }
    public string MaterialName { get; set; }
    public string Size { get; set; }
    public string Type { get; set; }
    public double MaterialPrice { get; set; }
    public int InventoryQuantity { get; set; }
}
