using Core.Entities;

namespace Core.Dtos;

public class InventoryDto
{
    public Guid MaterialId { get; set; }
    public string MaterialName { get; set; }
    public int Quantity { get; set; }
    
    public static InventoryDto FromEntity(Inventory inventory)
    {
        return new InventoryDto
        {
            MaterialId = inventory.MaterialId,
            MaterialName = inventory.Material.MaterialName,
            Quantity = inventory.Quantity
        };
    }
}
