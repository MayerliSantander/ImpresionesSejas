namespace Core.Entities;

public class UsedMaterial
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid MaterialId { get; set; }
    public int Quantity { get; set; }
    public Material Material { get; set; }
    public Product Product { get; set; }
}
