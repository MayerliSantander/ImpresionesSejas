using Core.Dtos;
using Core.Interfaces.Repositories;

namespace Core.Interfaces.UseCases;

public interface IQuotationUseCase : IBaseUseCase
{
    IQuotationRepository QuotationRepository { get; }
    IInventoryRepository InventoryRepository { get; }
    IQuotationDetailRepository QuotationDetailRepository { get; }
    IUserRepository UserRepository { get; }
    IActivityRepository ActivityRepository { get; }
    IProductRepository ProductRepository { get; }
    IMaterialRepository MaterialRepository { get; }
}
