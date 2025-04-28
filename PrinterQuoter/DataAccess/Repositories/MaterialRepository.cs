using Core.Interfaces.Repositories;
using Core.Entities;

namespace DataAccess.Repositories;

public class MaterialRepository: BaseRepository<Material>, IMaterialRepository
{
    public MaterialRepository(SqlContext context) : base(context) { }
}
