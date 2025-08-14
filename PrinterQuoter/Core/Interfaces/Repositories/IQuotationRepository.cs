using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IQuotationRepository : IBaseRepository<Quotation>
{
    Task<IEnumerable<Quotation>> GetQuotationsByUserIdAsync(Guid userId);
    Task<int> GetNextQuotationNumber();
}
