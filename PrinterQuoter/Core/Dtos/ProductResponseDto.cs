using Core.Entities;

namespace Core.Dtos;

public class ProductResponseDto
{
    public Guid Id { get; set; }
    public string ProductName { get; set; }
    public int MinimumQuantity { get; set; }
    public string Category { get; set; }
    public string ImageUrl { get; set; }
    public List<Guid> ActivityIds { get; set; }
    public List<UsedMaterialDto> UsedMaterials { get; set; }

    public static ProductResponseDto FromEntity(Product product)
    {
        return new ProductResponseDto
        {
            Id = product.Id,
            ProductName = product.ProductName,
            MinimumQuantity = product.MinimumQuantity,
            Category = product.Category,
            ImageUrl = product.ImageUrl,
            ActivityIds = product.Activities?.Select(a => a.Id).ToList() ?? new List<Guid>(),
            UsedMaterials = product.UsedMaterials?.Select(um => new UsedMaterialDto
            {
                MaterialId = um.MaterialId,
                Quantity = um.Quantity
            }).ToList() ?? new List<UsedMaterialDto>()
        };
    }
}
