using Core.Entities;

namespace Core.Dtos;

public class ShowOrderDto
{
    public Guid Id { get; set; }
    public int QuotationNumber { get; set; }
    public DateTime ConfirmationDate { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string UserName { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; }
    public List<ShowQuotationDetailDto> QuotationDetails { get; set; }
    
    public static ShowOrderDto FromEntity(Order order)
    {
        return new ShowOrderDto
        {
            Id = order.Id,
            QuotationNumber = order.Quotation.QuotationNumber,
            ConfirmationDate = order.ConfirmationDate,
            DeliveryDate = order.DeliveryDate,
            UserName = order.Quotation.User.UserName,
            TotalPrice = order.Quotation.TotalPrice,
            Status = order.Quotation.Status,
            QuotationDetails = order.Quotation.QuotationDetails
                .Select(q => ShowQuotationDetailDto.FromEntity(q))
                .ToList(),
        };
    }
}
