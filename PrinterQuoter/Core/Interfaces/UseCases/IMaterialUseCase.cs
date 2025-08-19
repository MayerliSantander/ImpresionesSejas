using Core.Interfaces.Repositories;

namespace Core.Interfaces.UseCases;

public interface IMaterialUseCase : IBaseUseCase
{
    IMaterialRepository MaterialRepository { get; }
    IInventoryRepository InventoryRepository { get; }
}
