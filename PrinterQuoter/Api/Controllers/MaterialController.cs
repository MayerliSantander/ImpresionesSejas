using System.ComponentModel.DataAnnotations;
using Api.Middleware;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class MaterialController : ControllerBase
{
    private readonly IMaterialService _service;
    private readonly IUserService _userService;

    public MaterialController(IMaterialService service, IUserService userService)
    {
        _service = service;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMaterials()
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var materials = await _service.GetAllMaterials();
        return Ok(materials);
    }

    [HttpGet("{idMaterial}")]
    public async Task<IActionResult> GetMaterialById([Required] Guid idMaterial)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var material = await _service.GetMaterialById(idMaterial);
        return Ok(material);
    }

    [HttpPost]
    public async Task<IActionResult> PostMaterial(MaterialDto materialDto)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var response = await _service.CreateMaterial(materialDto);
        return Ok(response);
    }
    
    [HttpPut("{idMaterial}")]
    public async Task<IActionResult> PutMaterial([Required]Guid idMaterial, MaterialDto materialDto)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var response = await _service.UpdateMaterial(idMaterial, materialDto);
        return Ok(response);
    }

    [HttpDelete("{idMaterial}")]
    public async Task<IActionResult> DeleteMaterial([Required] Guid idMaterial)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        await _service.DeleteMaterial(idMaterial);
        return NoContent();
    }
}
