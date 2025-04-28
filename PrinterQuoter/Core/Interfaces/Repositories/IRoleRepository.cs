using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IRoleRepository: IBaseRepository<Role>
{
    Task<Role?> GetRoleByDescription(string description);
}
