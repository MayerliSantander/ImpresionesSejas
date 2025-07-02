using Api.Middleware;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TemplateController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IUserService _userService;
    private readonly ITemplateValidationService _templateValidationService;

    public TemplateController(IWebHostEnvironment env, IUserService userService, ITemplateValidationService templateValidationService)
    {
        _env = env;
        _userService = userService;
        _templateValidationService = templateValidationService;
    }

    [HttpPost("Upload")]
    public async Task<IActionResult> UploadTemplate(IFormFile file)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized("Solo los administradores pueden subir plantillas.");
        }
        
        if (file == null || file.Length == 0)
            return BadRequest("Archivo no proporcionado.");

        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            byte[] fileBytes = memoryStream.ToArray();
            string validationError = await _templateValidationService.ValidateTemplateFileAsync(fileBytes, file.FileName);
            if (validationError != null)
            {
                return BadRequest(new { message = validationError });
            }
           
            string templatesPath = Path.Combine(_env.ContentRootPath, "Templates");
            if (!Directory.Exists(templatesPath))
                Directory.CreateDirectory(templatesPath);
            
            string savePath = Path.Combine(templatesPath, "plantilla_cotizacion.docx");
            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            return Ok(new { message = "Plantilla subida exitosamente." });
        }
    }
    
    [HttpGet("Current")]
    public IActionResult GetCurrentTemplate()
    {
        string templatesPath = Path.Combine(_env.ContentRootPath, "Templates");
        string templateFile = Path.Combine(templatesPath, "plantilla_cotizacion.docx");

        if (!System.IO.File.Exists(templateFile))
            return NotFound(new { message = "No hay plantilla cargada." });

        var info = new FileInfo(templateFile);

        return Ok(new
        {
            fileName = info.Name,
            sizeKB = (info.Length / 1024).ToString("F1"),
            lastModified = info.LastWriteTime
        });
    }
}
