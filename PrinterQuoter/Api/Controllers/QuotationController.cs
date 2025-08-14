using System.ComponentModel.DataAnnotations;
using Api.Middleware;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class QuotationController : ControllerBase
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

    [HttpGet("{quotationId}")]
    public async Task<IActionResult> GetById([Required] Guid quotationId)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var quotation = await _quotationService.GetQuotationById(quotationId);
        return Ok(quotation);
    }
    
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetQuotationsByUserIdAsync(Guid userId)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var quotations = await _quotationService.GetQuotationsByUserIdAsync(userId);
        return Ok(quotations);
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateQuotationAsync([FromBody] QuotationDto quotationDto)
    {
        try
        {
            User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
            if (user == null)
            {
                return Unauthorized();
            }
            var newQuotation = await _quotationService.CreateQuotation(quotationDto);
            return Ok(newQuotation);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPost("Send")]
    public async Task<IActionResult> Send(QuotationRequestDto request) 
    { 
        try
        {
            User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
            if (user == null)
            {
                return Unauthorized();
            }
            
            request.Bag.UserId = user.Id;
            
            if (string.IsNullOrWhiteSpace(request.Phone) || request.Bag == null || !request.Bag.QuotationDetailDtos.Any()) 
                return BadRequest("Teléfono y productos requeridos.");

            var showQuotationDto = await _quotationService.CreateQuotation(request.Bag);
            var success = await _whatsAppService.SendQuotationDocument(request.Phone, showQuotationDto.DocumentPath);

            if (!success)
                return StatusCode(500, "No se pudo enviar el mensaje por WhatsApp.");

            return Ok(new { message = "Cotización enviada por WhatsApp." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno: {ex.Message}");
        }
    } 
    
    [HttpPut("request-confirmation/{quotationId}")]
    public async Task<IActionResult> RequestConfirmationAsync(Guid quotationId)
    {
        try
        {
            User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
            if (user == null)
            {
                return Unauthorized();
            }
            
            var result = await _quotationService.RequestConfirmationAsync(quotationId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }
    
    [HttpPut("update-status/{quotationId}")]
    public async Task<IActionResult> UpdateQuotationStatus(Guid quotationId)
    {
        try
        {
            User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
            if (user == null)
            {
                return Unauthorized();
            }

            var updatedQuotation = await _quotationService.UpdateQuotationStatus(quotationId);
        
            if (updatedQuotation == null)
            {
                return NotFound("Cotización no encontrada.");
            }

            return Ok(ShowQuotationDto.FromEntity(updatedQuotation));
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
