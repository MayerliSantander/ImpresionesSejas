using Core.Entities;

namespace Core.Dtos;

public class QuotationDetailDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public Guid MaterialId { get; set; }
    public List<Guid> ActivityIds { get; set; }
    
    public QuotationDetail CreateQuotationDetail()
    {
        QuotationDetail quotationDetail = new QuotationDetail();
        quotationDetail.Id = Guid.NewGuid();
        quotationDetail.QuotationId = Guid.Empty;
        quotationDetail.ProductId = ProductId;
        quotationDetail.Quantity = Quantity;
        quotationDetail.Price = 0;
        quotationDetail.MaterialId = MaterialId;
        quotationDetail.Activities = new List<Activity>();
        return quotationDetail;
    }
}
