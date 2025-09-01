namespace Core.Dtos.Reports;

public class IdleItemsDto
{
    public List<IdleProductItemDto> Products { get; set; }
    public List<IdleMaterialItemDto> Materials { get; set; }
}

public class IdleProductItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = "";
    public string? Category { get; set; }
}

public class IdleMaterialItemDto
{
    public Guid MaterialId { get; set; }
    public string MaterialName { get; set; } = "";
    public string? MaterialType { get; set; }
}
