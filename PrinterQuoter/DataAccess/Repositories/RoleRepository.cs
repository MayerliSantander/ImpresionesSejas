using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class RoleRepository: BaseRepository<Role>, IRoleRepository
{
    public RoleRepository(SqlContext context) : base(context) { }
    public async Task<Role?> GetRoleByDescription(string description)
    {
        return await dbSet.FirstOrDefaultAsync(r => r.Description == description);
    }
}
