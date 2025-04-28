using Core.Interfaces.UseCases;

namespace DataAccess.UseCases;

public abstract class BaseUseCase : IBaseUseCase
{
    protected readonly SqlContext _context;

    protected BaseUseCase(SqlContext context)
    {
        _context = context;
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    public async Task<int> Commitment()
    {
        return await _context.SaveChangesAsync();
    }
}
