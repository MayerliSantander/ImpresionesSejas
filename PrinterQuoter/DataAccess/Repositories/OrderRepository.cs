using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    private SqlContext _context;

    public OrderRepository(SqlContext context) : base(context)
    {
        _context = context;
    }
    
    public override async Task<IEnumerable<Order>> GetAll()
    {
        return await _context.Orders
            .Include(o => o.Quotation)
                .ThenInclude(q => q.User)
            .Include(o => o.Quotation)
                .ThenInclude(q => q.QuotationDetails)
                    .ThenInclude(d => d.Product)
                        .ThenInclude(p => p.UsedMaterials)
            .Include(o => o.Quotation)
                .ThenInclude(q => q.QuotationDetails)
                    .ThenInclude(d => d.Material)
            .Include(o => o.Quotation)
                .ThenInclude(q => q.QuotationDetails)
                    .ThenInclude(d => d.Activities)
            .OrderByDescending(o => o.ConfirmationDate)
            .ToListAsync();
    }
    
    public override async ValueTask<Order> GetById(Guid id)
    {
        return await _context.Orders
            .Include(o => o.Quotation)
                .ThenInclude(q => q.User)
            .Include(o => o.Quotation)
                .ThenInclude(q => q.QuotationDetails)
                    .ThenInclude(d => d.Product)
                        .ThenInclude(p => p.UsedMaterials)
            .Include(o => o.Quotation)
                .ThenInclude(q => q.QuotationDetails)
                    .ThenInclude(d => d.Material)
            .Include(o => o.Quotation)
                .ThenInclude(q => q.QuotationDetails)
                    .ThenInclude(d => d.Activities)
            .FirstOrDefaultAsync(p => p.Id == id) ?? throw new InvalidOperationException();
    }
    
    public async Task<int> CountByConfirmationDateRangeAsync(DateTime fromInclusive, DateTime toInclusive)
    {
        var toExclusive = toInclusive.Date.AddDays(1);
        return await _context.Orders
            .CountAsync(o => o.ConfirmationDate >= fromInclusive.Date && o.ConfirmationDate < toExclusive);
    }

    public async Task<List<Order>> GetByQuotationDateRangeAsync(DateTime fromInclusive, DateTime toInclusive)
    {
        var toExclusive = toInclusive.Date.AddDays(1);
        return await _context.Orders
            .Include(o => o.Quotation)
            .Where(o => o.Quotation.Date >= fromInclusive.Date && o.Quotation.Date < toExclusive)
            .AsNoTracking()
            .ToListAsync();
    }
}
