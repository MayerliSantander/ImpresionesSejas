namespace Core.Dtos;

public class StockAdjustmentDto
{
    public Guid MaterialId { get; set; }
    public int QuantityToDeduct { get; set; }
}
