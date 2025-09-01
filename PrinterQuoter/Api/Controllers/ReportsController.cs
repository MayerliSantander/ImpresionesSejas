using System.ComponentModel.DataAnnotations;
using Api.Middleware;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IReportService _reportService;

    public ReportsController(IUserService userService, IReportService reportService)
    {
        _userService = userService;
        _reportService = reportService;
    }

    private async Task<bool> IsAuthenticatedAsync()
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        return user != null;
    }

    [HttpGet("funnel")]
    public async Task<IActionResult> GetFunnel([Required] DateTime from, [Required] DateTime to)
    {
        //if (!await IsAuthenticatedAsync()) return Unauthorized();
        if (from > to) return BadRequest("Parámetros inválidos: from > to.");

        var result = await _reportService.GetFunnelAsync(from, to);
        return Ok(result);
    }

    [HttpGet("conversion")]
    public async Task<IActionResult> GetConversion([Required] DateTime from, [Required] DateTime to)
    {
        //if (!await IsAuthenticatedAsync()) return Unauthorized();
        if (from > to) return BadRequest("Parámetros inválidos: from > to.");

        var result = await _reportService.GetConversionAsync(from, to);
        return Ok(result);
    }

    [HttpGet("expiring")]
    public async Task<IActionResult> GetExpiring([FromQuery] int days = 3, DateTime? from = null, DateTime? to = null)
    {
        //if (!await IsAuthenticatedAsync()) return Unauthorized();
        if (from.HasValue && to.HasValue && from > to) return BadRequest("Parámetros inválidos: from > to.");

        var result = await _reportService.GetExpiringAsync(days, from, to);
        return Ok(result);
    }

    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts([Required] DateTime from, [Required] DateTime to, int limit = 10)
    {
        //if (!await IsAuthenticatedAsync()) return Unauthorized();
        if (from > to) return BadRequest("Parámetros inválidos: from > to.");
        if (limit <= 0) limit = 10;

        var result = await _reportService.GetTopProductsAsync(from, to, limit);
        return Ok(result);
    }

    [HttpGet("idle-items")]
    public async Task<IActionResult> GetIdleItems([Required] DateTime from, [Required] DateTime to)
    {
        //if (!await IsAuthenticatedAsync()) return Unauthorized();
        if (from > to) return BadRequest("Parámetros inválidos: from > to.");

        var result = await _reportService.GetIdleItemsAsync(from, to);
        return Ok(result);
    }

    [HttpGet("kpis")]
    public async Task<IActionResult> GetKpis(int windowDays = 30, int stockThreshold = 5)
    {
        //if (!await IsAuthenticatedAsync()) return Unauthorized();

        var result = await _reportService.GetKpisAsync(windowDays, stockThreshold);
        return Ok(result);
    }
}
