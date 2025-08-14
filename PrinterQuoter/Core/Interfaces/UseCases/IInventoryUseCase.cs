using Core.Dtos;
using Core.Interfaces.Repositories;

namespace Core.Interfaces.UseCases;

public interface IInventoryUseCase : IBaseUseCase
{
    IInventoryRepository InventoryRepository { get; }
}
