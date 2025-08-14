namespace Core.Entities;

public class Inventory
{
    public Guid Id { get; set; }
    public Guid MaterialId { get; set; }
    public Material Material { get; set; }
    public int Quantity { get; set; }
}
