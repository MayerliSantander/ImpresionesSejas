using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IQuotationDetailRepository : IBaseRepository<QuotationDetail>
{
    Task<List<QuotationDetail>> GetByQuotationIdsAsync(IEnumerable<Guid> quotationIds);
}
