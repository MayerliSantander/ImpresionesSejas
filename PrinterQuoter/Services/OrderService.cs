using Core.Dtos;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class OrderService : IOrderService
{
    private readonly IOrderUseCase _orderUseCase;

    public OrderService(IOrderUseCase orderUseCase)
    {
        _orderUseCase = orderUseCase;
    }

    public async Task<IEnumerable<ShowOrderDto>> GetAllOrders()
    {
        var orders = await _orderUseCase.OrderRepository.GetAll();
        return orders.Select(ShowOrderDto.FromEntity);
    }
    
    public async ValueTask<ShowOrderDto> GetOrderById(Guid orderId)
    {
        var order = await _orderUseCase.OrderRepository.GetById(orderId);
        return ShowOrderDto.FromEntity(order);
    }
}
