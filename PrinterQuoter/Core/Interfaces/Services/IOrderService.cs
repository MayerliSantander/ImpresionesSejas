using Core.Dtos;

namespace Core.Interfaces.Services;

public interface IOrderService
{
    Task<IEnumerable<ShowOrderDto>> GetAllOrders();
    ValueTask<ShowOrderDto> GetOrderById(Guid orderId);
}
