using Core.Interfaces.Repositories;
using Core.Entities;

namespace DataAccess.Repositories;

public class ActivityRepository : BaseRepository<Activity>, IActivityRepository
{
    public ActivityRepository(SqlContext context) : base(context) { }
}
