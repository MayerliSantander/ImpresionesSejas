using Core.Interfaces.Repositories;

namespace Core.Interfaces.UseCases;

public interface IActivityUseCase : IBaseUseCase
{
    IActivityRepository ActivityRepository { get; }
}
