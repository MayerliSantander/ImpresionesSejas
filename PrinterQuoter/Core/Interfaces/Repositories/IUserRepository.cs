using Core.Entities;

namespace Core.Interfaces.Repositories;

public interface IUserRepository : IBaseRepository<User>
{
    Task<IEnumerable<User>> GetByGoogleId(string googleId);
    Task<List<User>> GetByIdsAsync(IEnumerable<Guid> ids);
}
