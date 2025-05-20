using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class ActivityUseCase: BaseUseCase, IActivityUseCase
{
    public ActivityUseCase(SqlContext context) : base(context) { }
    private IActivityRepository _activityRepository;

    public IActivityRepository GetActivityRepository()
    {
        if (_activityRepository == null){
            _activityRepository = new ActivityRepository(_context);
        }
        return _activityRepository;
    }
    IActivityRepository IActivityUseCase.ActivityRepository => GetActivityRepository();
}
