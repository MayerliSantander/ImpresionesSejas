namespace Core.Dtos.Reports;

public class ExpiringQuotationDto
{
    public Guid Id { get; set; }
    public int QuotationNumber { get; set; }
    public string UserName { get; set; } = "";
    public DateTime Date { get; set; }
    public DateTime ExpiresIn { get; set; }
    public string Status { get; set; } = "";
}
