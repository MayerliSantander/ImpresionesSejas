using Core.Entities;

namespace Core.Dtos;

public class ShowQuotationDto
{
    public Guid Id { get; set; }
    public int QuotationNumber { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalPrice { get; set; }
    public int ValidityDays { get; set; }
    public string Status { get; set; }
    public DateTime? RequestedConfirmationDate { get; set; }
    public List<ShowQuotationDetailDto> QuotationDetails { get; set; }
    public string DocumentPath { get; set; }
    
    public static ShowQuotationDto FromEntity(Quotation quotation)
    {
        return new ShowQuotationDto
        {
            Id = quotation.Id,
            QuotationNumber = quotation.QuotationNumber,
            UserId = quotation.User.Id,
            UserName = quotation.User.UserName,
            Date = quotation.Date,
            TotalPrice = quotation.TotalPrice,
            ValidityDays = quotation.ValidityDays,
            Status = quotation.Status,
            RequestedConfirmationDate = quotation.RequestedConfirmationDate,
            QuotationDetails = quotation.QuotationDetails
                .Select(q => ShowQuotationDetailDto.FromEntity(q))
                .ToList(),
            DocumentPath = quotation.DocumentPath
        };
    }
}
