using Core.Entities;

namespace Core.Dtos;

public class QuotationDto
{
    public Guid UserId { get; set; }
    public List<QuotationDetailDto> QuotationDetailDtos { get; set; }
    
    public Quotation CreateQuotation()
    {
        Quotation quotation = new Quotation();
        quotation.Id = Guid.NewGuid();
        quotation.QuotationNumber = 0;
        quotation.UserId = UserId;
        quotation.OrderId = Guid.Empty;
        quotation.Date = DateTime.Now;
        quotation.TotalPrice = 0;
        quotation.ValidityDays = 7;
        quotation.Status = "Pendiente";
        quotation.QuotationDetails = new List<QuotationDetail>(); 
        return quotation;
    }
}
