using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class ProductService: IProductService
{
    private readonly IProductUseCase _productUseCase;

    public ProductService(IProductUseCase productUseCase)
    {
        _productUseCase = productUseCase;
    }

    public async ValueTask<ProductDto> GetProductById(Guid id)
    {
        var product = await _productUseCase.ProductRepository.GetById(id);
        return ProductDto.FromEntity(product);
    }

    public async Task<IEnumerable<ProductResponseDto>> GetAllProducts()
    {
        var products = await _productUseCase.ProductRepository.GetAll();
        return products.Select(ProductResponseDto.FromEntity);
    }
    
    public async Task<IEnumerable<ProductResponseDto>> GetProductsByCategory(string category)
    {
        var products = await _productUseCase.ProductRepository.GetProductsByCategory(category);
        return products.Select(ProductResponseDto.FromEntity);
    }
    
    public async Task<IEnumerable<string>> GetCategories()
    {
        var products = await _productUseCase.ProductRepository.GetAll();
        var categories = products.Select(p => p.Category).Distinct().ToList();
        return categories;
    }

    public async Task<ProductDto> CreateProduct(ProductDto productDto)
    {
        Product product = productDto.CreateProduct();
        await _productUseCase.ProductRepository.Add(product);

        foreach (UsedMaterialDto usedMaterialDto in productDto.UsedMaterials)
        {
            try
            {
                UsedMaterial usedMaterial = usedMaterialDto.CreateUsedMaterial();
                
                usedMaterial.ProductId = product.Id;
                
                product.UsedMaterials.Add(usedMaterial);
                await _productUseCase.UsedMaterialRepository.Add(usedMaterial);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        foreach (Guid activityId in productDto.ActivityIds)
        {
            Activity activity = await _productUseCase.ActivityRepository.GetById(activityId);
            if (activity != null)
            {
                product.Activities.Add(activity);
            }
        }

        await _productUseCase.Commitment();
        return ProductDto.FromEntity(product);
    }

    public async Task<ProductDto> UpdateProduct(Guid id, ProductDto productDto)
    {
        Product product = await _productUseCase.ProductRepository.GetById(id);
        if (product == null)
        {
            throw new Exception("Product not found");
        }

        product.ProductName = productDto.ProductName;
        product.MinimumQuantity = productDto.MinimumQuantity;
        product.Category = productDto.Category;
        product.SizeInCm = productDto.SizeInCm;
        product.Description = productDto.Description;
        product.ImageUrls = productDto.ImageUrls ?? new List<string>();

        var existingUsedMaterials = product.UsedMaterials.ToList();
        var usedMaterialsToMatch = productDto.UsedMaterials.ToList();

        foreach (UsedMaterial usedMaterial in existingUsedMaterials)
        {
            bool found = false;
            foreach (UsedMaterialDto usedMaterialDto in usedMaterialsToMatch)
            {
                if (usedMaterial.MaterialId == usedMaterialDto.MaterialId)
                {
                    found = true;
                    usedMaterial.Quantity = usedMaterialDto.Quantity;
                    await _productUseCase.UsedMaterialRepository.Update(usedMaterial);
                    productDto.UsedMaterials.Remove(usedMaterialDto);
                    break;
                }
            }
            if (!found)
            {
                product.UsedMaterials.Remove(usedMaterial);
                _productUseCase.UsedMaterialRepository.Remove(usedMaterial);
            }
        }

        foreach (UsedMaterialDto usedMaterialDto in productDto.UsedMaterials)
        {
            UsedMaterial usedMaterial = usedMaterialDto.CreateUsedMaterial();
            usedMaterial.ProductId = product.Id;
            product.UsedMaterials.Add(usedMaterial);
            await _productUseCase.UsedMaterialRepository.Add(usedMaterial);
        }

        product.Activities = new List<Activity>();
        foreach (Guid activityId in productDto.ActivityIds)
        {
            var activity = await _productUseCase.ActivityRepository.GetById(activityId);
            if (activity != null)
            {
                product.Activities.Add(activity);
            }
        }

        await _productUseCase.ProductRepository.Update(product);
        await _productUseCase.Commitment();
        return ProductDto.FromEntity(product);
    }

    public async Task DeleteProduct(Guid id)
    {
        Product productToDelete = await _productUseCase.ProductRepository.GetById(id);
        if (productToDelete != null)
        {
            _productUseCase.ProductRepository.Remove(productToDelete);
            await _productUseCase.Commitment();
        }
    }
}
