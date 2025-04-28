using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class UserRepository: BaseRepository<User>, IUserRepository
{
    public UserRepository(SqlContext context) : base(context) { }
    public async Task<IEnumerable<User>> GetByGoogleId(string googleId)
    {
        IQueryable<User> query = dbSet
            .Where(u => u.GoogleId == googleId)
            .Include(u => u.Roles);
        return await query.ToListAsync();
    }
}
