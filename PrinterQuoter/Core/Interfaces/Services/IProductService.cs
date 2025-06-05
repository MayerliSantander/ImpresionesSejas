using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Services;

public interface IProductService
{
    ValueTask<ProductDto> GetProductById(Guid productId);
    Task<IEnumerable<ProductResponseDto>> GetAllProducts();
    Task<ProductDto> CreateProduct(ProductDto productDto);
    Task<ProductDto> UpdateProduct(Guid id, ProductDto productDto);
    Task DeleteProduct(Guid productId);
}
