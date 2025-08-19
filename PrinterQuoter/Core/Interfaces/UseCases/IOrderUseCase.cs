using Core.Interfaces.Repositories;

namespace Core.Interfaces.UseCases;

public interface IOrderUseCase : IBaseUseCase
{
    IOrderRepository OrderRepository { get; }
}
