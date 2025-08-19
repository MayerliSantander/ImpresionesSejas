using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class QuotationRepository : BaseRepository<Quotation>, IQuotationRepository
{
    private SqlContext _context;

    public QuotationRepository(SqlContext context) : base(context)
    {
        _context = context;
    }
    
    public override async Task<IEnumerable<Quotation>> GetAll()
    {
        return await _context.Quotations
            .Include(q => q.User)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Product)
                    .ThenInclude(p => p.UsedMaterials)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Material)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Activities)
            .ToListAsync();
    }

    public async Task<IEnumerable<Quotation>> GetPendingQuotations()
    {
        return await _context.Quotations
            .Where(q => q.Status == "Esperando confirmación")
            .Include(q => q.User)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Product)
                    .ThenInclude(p => p.UsedMaterials)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Material)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Activities)
            .OrderByDescending(q => q.RequestedConfirmationDate)
            .ToListAsync();
    }
    
    public override async ValueTask<Quotation> GetById(Guid id)
    {
        return await _context.Quotations
            .Include(q => q.User)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Product)
                    .ThenInclude(p => p.UsedMaterials)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Material)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Activities)
            .FirstOrDefaultAsync(p => p.Id == id) ?? throw new InvalidOperationException();
    }
    
    public async Task<IEnumerable<Quotation>> GetQuotationsByUserIdAsync(Guid userId)
    {
        return await _context.Quotations
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Product)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Material)
            .Include(q => q.QuotationDetails)
                .ThenInclude(d => d.Activities)
            .Include(q => q.User)
            .Where(q => q.User.Id == userId)
            .ToListAsync();
    }
    
    public async Task<int> GetNextQuotationNumber()
    {
        var lastQuotation = await _context.Quotations
            .OrderByDescending(q => q.QuotationNumber)
            .FirstOrDefaultAsync();

        return lastQuotation == null ? 1 : lastQuotation.QuotationNumber + 1;
    }
}
