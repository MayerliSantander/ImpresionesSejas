using System.ComponentModel.DataAnnotations;
using Api.Middleware;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ActivityController: ControllerBase
{
    private readonly IActivityService _service;
    private readonly IUserService _userService;

    public ActivityController(IActivityService service, IUserService userService)
    {
        _service = service;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetActivities()
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var activities = await _service.GetAllActivities();
        return Ok(activities);
    }

    [HttpGet("{idActivity}")]
    public async Task<IActionResult> GetById([Required] Guid idActivity)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var activity = await _service.GetActivityById(idActivity);
        return Ok(activity);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ActivityDto activityDto)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var result = await _service.CreateActivity(activityDto);
        return Ok(result);
    }

    [HttpPut("{idActivity}")]
    public async Task<IActionResult> Put([Required] Guid idActivity, ActivityDto activityDto)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var result = await _service.UpdateActivity(idActivity, activityDto);
        return Ok(result);
    }

    [HttpDelete("{idActivity}")]
    public async Task<IActionResult> Delete([Required] Guid idActivity)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        await _service.DeleteActivity(idActivity);
        return NoContent();
    }
}
