using System.Text;
using Api.Middleware;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class QuotationController: ControllerBase
{
    private readonly IUserService _userService;
    private readonly IQuotationService _quotationService;
    private readonly WhatsAppService _whatsAppService;
    
    public QuotationController(WhatsAppService whatsAppService, IUserService userService, IQuotationService quotationService) 
    {
        _whatsAppService = whatsAppService;
        _userService = userService;
        _quotationService = quotationService;
    }

    [HttpPost("Send")]
    public async Task<IActionResult> Send(QuotationRequestDto request) 
    { 
        try
        {
            User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
            if (user == null)
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(request.Phone) || request.Bag == null || !request.Bag.Any()) 
                return BadRequest("Teléfono y productos requeridos.");

            var message = _quotationService.BuildQuotationMessage(request.Bag);
            var success = await _whatsAppService.SendQuotation(request.Phone, message); 

            if (!success)
                return StatusCode(500, "No se pudo enviar el mensaje por WhatsApp.");

            return Ok(new { message = "Cotización enviada por WhatsApp." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    } 
}
