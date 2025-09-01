namespace Core.Dtos.Reports;

public class ConversionReportDto
{
    public int Quotations { get; set; }
    public int Confirmed { get; set; }
    public decimal ConversionPct { get; set; }
    public double? AverageDaysConfirmation { get; set; }
}
