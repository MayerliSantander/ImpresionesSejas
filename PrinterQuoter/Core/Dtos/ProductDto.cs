using Core.Entities;

namespace Core.Dtos;

public class ProductDto
{
    public string ProductName { get; set; }
    public int MinimumQuantity { get; set; }
    public string Category { get; set; }
    public string ImageUrl { get; set; }
    public List<Guid> ActivityIds { get; set; }
    public List<UsedMaterialDto> UsedMaterials { get; set; }
    
    public Product CreateProduct()
    {
        Product product = new Product();
        product.Id = Guid.NewGuid();
        product.ProductName = ProductName;
        product.MinimumQuantity = MinimumQuantity;
        product.Category = Category;
        product.ImageUrl = ImageUrl;
        product.UsedMaterials = new List<UsedMaterial>();
        product.Activities = new List<Activity>();
        return product;
    }
    
    public static ProductDto FromEntity(Product product)
    {
        return new ProductDto
        {
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
