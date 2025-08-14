namespace Core.Entities;

public class Activity
{
    public Guid Id { get; set; }
    public string ActivityName { get; set; }
    public double Price { get; set; }
    public ICollection<Product> Products { get; set; }
    public ICollection<QuotationDetail> QuotationDetails { get; set; }
}
