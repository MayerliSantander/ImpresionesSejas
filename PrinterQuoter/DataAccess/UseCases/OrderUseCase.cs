using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class OrderUseCase : BaseUseCase, IOrderUseCase
{
    public OrderUseCase(SqlContext context) : base(context) { }
    private IOrderRepository _orderRepository;
    
    public IOrderRepository GetOrderRepository()
    {
        if (_orderRepository == null){
            _orderRepository = new OrderRepository(_context);
        }
        return _orderRepository;
    }

    IOrderRepository IOrderUseCase.OrderRepository => GetOrderRepository();
}
