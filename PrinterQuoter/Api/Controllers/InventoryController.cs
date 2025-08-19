using Api.Middleware;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;
    private readonly IUserService _userService;

    public InventoryController(IInventoryService inventoryService,  IUserService userService)
    {
        _inventoryService = inventoryService;
        _userService = userService;
    }

    [HttpGet("material/{materialId}")]
    public async Task<IActionResult> GetInventoryByMaterialIdAsync(Guid materialId)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        try
        {
            var inventory = await _inventoryService.GetInventoryByMaterialIdAsync(materialId);
            return Ok(inventory);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor.", detail = ex.Message });
        }
    }
    
    [HttpPut("material/{materialId}")]
    public async Task<IActionResult> UpdateInventoryByMaterialIdAsync(Guid materialId, UpdateInventoryQuantityDto inventoryDto)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        
        if (inventoryDto.Quantity < 0)
        {
            return BadRequest("La cantidad no puede ser negativa.");
        }
        
        try
        {
            var updated = await _inventoryService.UpdateInventoryQuantityAsync(materialId, inventoryDto.Quantity);
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor.", detail = ex.Message });
        }
    }
}
