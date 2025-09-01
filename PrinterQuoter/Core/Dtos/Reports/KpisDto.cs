namespace Core.Dtos.Reports;

public class KpisDto
{
    public int QuotationsToday { get; set; }
    public decimal Conversion30dPct { get; set; }
    public decimal AmountConfirmed30d { get; set; }
    public int ToExpireIn3d { get; set; }
    public int CriticalStock { get; set; }
}
