using Core.Entities;
using Core.Interfaces.Repositories;

namespace DataAccess.Repositories;

public class UsedMaterialRepository: BaseRepository<UsedMaterial>, IUsedMaterialRepository
{
    public UsedMaterialRepository(SqlContext context) : base(context) { }
}
