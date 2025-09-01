using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IOrderRepository : IBaseRepository<Order>
{
    Task<int> CountByConfirmationDateRangeAsync(DateTime fromInclusive, DateTime toInclusive);
    Task<List<Order>> GetByQuotationDateRangeAsync(DateTime fromInclusive, DateTime toInclusive);
}
