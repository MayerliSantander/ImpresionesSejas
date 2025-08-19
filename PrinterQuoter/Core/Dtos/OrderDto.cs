using Core.Entities;

namespace Core.Dtos;

public class OrderDto
{
    public Guid QuotationId { get; set; }
    
    public Order CreateOrder()
    {
        Order order = new Order();
        order.Id = Guid.NewGuid();
        order.ConfirmationDate = DateTime.Now;
        order.QuotationId = QuotationId;
        return order;
    }
}
