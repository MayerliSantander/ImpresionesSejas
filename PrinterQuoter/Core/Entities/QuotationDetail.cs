namespace Core.Entities;

public class QuotationDetail
{
    public Guid Id { get; set; }
    public Guid QuotationId { get; set; }
    public Quotation Quotation { get; set; }
    public Guid ProductId { get; set; }
    public Product Product { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public Guid MaterialId { get; set; }
    public Material Material { get; set; }
    public ICollection<Activity> Activities { get; set; }
}
