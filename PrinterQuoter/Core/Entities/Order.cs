namespace Core.Entities;

public class Order
{
    public Guid Id { get; set; }
    public DateTime ConfirmationDate { get; set; }
    public DateTime DeliveryDate { get; set; }
    public Quotation Quotation { get; set; }
}