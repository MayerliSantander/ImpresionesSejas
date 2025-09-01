namespace Core.Dtos;

public class ConfirmQuotationResultDto
{
    public ShowQuotationDto Quotation { get; set; }
    public Guid OrderId { get; set; }
    public bool NotificationSent { get; set; }
    public string? NotificationError { get; set; }
}
