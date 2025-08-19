using System.ComponentModel.DataAnnotations;
using Api.Middleware;
using Core.Entities;
using Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class OrderController: ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IUserService _userService;

    public OrderController(IOrderService orderService, IUserService userService)
    {
        _orderService = orderService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrders()
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var orders = await _orderService.GetAllOrders();
        return Ok(orders);
    }
    
    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetById([Required] Guid orderId)
    {
        User user = await Authentication.CurrentUser(Request.Headers["Authorization"], _userService);
        if (user == null)
        {
            return Unauthorized();
        }
        var quotation = await _orderService.GetOrderById(orderId);
        return Ok(quotation);
    }
}
