using Core.Interfaces.Repositories;

namespace Core.Interfaces.UseCases;

public interface IProductUseCase : IBaseUseCase
{
    IProductRepository ProductRepository { get; }
    IMaterialRepository MaterialRepository { get; }
    IActivityRepository ActivityRepository { get; }
    IUsedMaterialRepository UsedMaterialRepository { get; }
}
