namespace Core.Entities;

public class Quotation
{
    public Guid Id { get; set; }
    public User User { get; set; }
    public Order Order { get; set; }
    public DateTime Date { get; set; }
    public Double TotalPrice { get; set; }
    public ICollection<Product> Products { get; set; }
}