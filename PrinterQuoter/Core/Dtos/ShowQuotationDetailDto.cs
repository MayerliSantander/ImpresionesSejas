using Core.Entities;

namespace Core.Dtos;

public class ShowQuotationDetailDto
{
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string MaterialName { get; set; }
    public List<string> Activities { get; set; }
    
    public static ShowQuotationDetailDto FromEntity(QuotationDetail detail)
    {
        return new ShowQuotationDetailDto()
        {
            ProductName = detail.Product.ProductName,
            Quantity = detail.Quantity,
            Price = detail.Price,
            MaterialName = detail.Material.MaterialName,
            Activities = detail.Activities?.Select(a => a.ActivityName).ToList() ?? new List<string>()
        };
    }
}
