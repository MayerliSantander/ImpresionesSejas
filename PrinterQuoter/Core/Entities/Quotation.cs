namespace Core.Entities;

public class Quotation
{
    public Guid Id { get; set; }
    public int QuotationNumber { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public Guid? OrderId { get; set; }
    public Order? Order { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalPrice { get; set; }
    public int ValidityDays { get; set; }
    public string Status { get; set; }
    public DateTime? RequestedConfirmationDate { get; set; }
    public ICollection<QuotationDetail> QuotationDetails { get; set; }
    public string? DocumentPath { get; set; }
}
