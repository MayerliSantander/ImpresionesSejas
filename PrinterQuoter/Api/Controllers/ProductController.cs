using System.ComponentModel.DataAnnotations;
using Api.Middleware;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController: ControllerBase
{
    private readonly IProductService _service;
    private readonly IUserService _userService;

    public ProductController(IProductService service, IUserService userService)
    {
        _service = service;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var products = await _service.GetAllProducts();
        return Ok(products);
    }
    
    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetProductsByCategory(string category)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var products = await _service.GetProductsByCategory(category);
        if (products == null || !products.Any())
        {
            return NotFound("No se encontraron productos para esta categoría.");
        }
        return Ok(products);
    }
    
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var categories = await _service.GetCategories();
        return Ok(categories);
    }

    [HttpGet("{idProduct}")]
    public async Task<IActionResult> GetById([Required] Guid idProduct)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var product = await _service.GetProductById(idProduct);
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ProductDto productDto)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }

        try
        {
            if (productDto.ImageUrls == null || !productDto.ImageUrls.Any())
            {
                return BadRequest("Debe proporcionar al menos una URL de imagen.");
            }
            
            var result = await _service.CreateProduct(productDto);
            return Ok(result);
        }
        catch (Exception e)
        {
            return NotFound();
        }
    }

    [HttpPut("{idProduct}")]
    public async Task<IActionResult> Put([Required] Guid idProduct, ProductDto productDto)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        
        if (productDto.ImageUrls == null || !productDto.ImageUrls.Any())
        {
            return BadRequest("Debe proporcionar al menos una URL de imagen.");
        }
        
        var result = await _service.UpdateProduct(idProduct, productDto);
        return Ok(result);
    }

    [HttpDelete("{idProduct}")]
    public async Task<IActionResult> Delete([Required] Guid idProduct)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        await _service.DeleteProduct(idProduct);
        return NoContent();
    }
}
