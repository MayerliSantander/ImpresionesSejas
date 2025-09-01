using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class QuotationDetailRepository : BaseRepository<QuotationDetail>, IQuotationDetailRepository
{
    private SqlContext _context;

    public QuotationDetailRepository(SqlContext context) : base(context)
    {
        _context = context;
    }
    
    
    public async Task<List<QuotationDetail>> GetByQuotationIdsAsync(IEnumerable<Guid> quotationIds)
    {
        var set = quotationIds?.ToHashSet() ?? new HashSet<Guid>();
        return await _context.QuotationDetails
            .Where(d => set.Contains(d.QuotationId))
            .AsNoTracking()
            .ToListAsync();
    }
}
