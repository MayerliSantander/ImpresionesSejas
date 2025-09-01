using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class UserRepository: BaseRepository<User>, IUserRepository
{
    private SqlContext _context;

    public UserRepository(SqlContext context) : base(context)
    {
        _context = context;
    }
    public async Task<IEnumerable<User>> GetByGoogleId(string googleId)
    {
        IQueryable<User> query = dbSet
            .Where(u => u.GoogleId == googleId)
            .Include(u => u.Roles);
        return await query.ToListAsync();
    }
    
    public async Task<List<User>> GetByIdsAsync(IEnumerable<Guid> ids)
    {
        var set = ids?.ToHashSet() ?? new HashSet<Guid>();
        return await _context.Users
            .Where(u => set.Contains(u.Id))
            .AsNoTracking()
            .ToListAsync();
    }
}
