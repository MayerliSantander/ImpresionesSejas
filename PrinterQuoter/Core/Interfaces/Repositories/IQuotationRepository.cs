using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IQuotationRepository : IBaseRepository<Quotation>
{
    Task<IEnumerable<Quotation>> GetPendingQuotations();
    Task<IEnumerable<Quotation>> GetQuotationsByUserIdAsync(Guid userId);
    Task<int> GetNextQuotationNumber();
    Task<IEnumerable<Quotation>> GetByDateRangeAsync(DateTime fromInclusive, DateTime toInclusive);
    Task<IEnumerable<Quotation>> GetByStatusAndDateRangeAsync(string status, DateTime fromInclusive, DateTime toInclusive);
    Task<IEnumerable<Quotation>> GetByIdsAsync(IEnumerable<Guid> ids);
}
