using Core.Interfaces.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthenticationController: ControllerBase
{
    private readonly IUserService _service;

    public AuthenticationController(IUserService service)
    {
        _service = service;
    }
    [HttpPost("Login")]
    public async Task<IActionResult> Login()
    {
        string token = Request.Headers["Authorization"];
        if (token == null)
        {
            return Unauthorized();
        }
        GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token);
        if (payload == null)
        {
            return Unauthorized();
        }
        var user = await _service.LoginOrRegisterGoogleAsync(payload.Subject, payload.Name, payload.Email);
        var roles = user.Roles
            .Select(r => new { description = r.Description })
            .ToArray();

        return Ok(new {
            name = user.UserName,
            email = user.Email,
            roles = roles
        });
    }
}
