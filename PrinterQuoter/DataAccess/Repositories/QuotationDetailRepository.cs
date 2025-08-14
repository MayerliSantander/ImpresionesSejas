using Core.Entities;
using Core.Interfaces.Repositories;

namespace DataAccess.Repositories;

public class QuotationDetailRepository : BaseRepository<QuotationDetail>, IQuotationDetailRepository
{
    public QuotationDetailRepository(SqlContext context) : base(context) { }
}
