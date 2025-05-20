using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class ActivityService: IActivityService
{
    private readonly IActivityUseCase _activityUseCase;

    public ActivityService(IActivityUseCase activityUseCase)
    {
        _activityUseCase = activityUseCase;
    }

    public async ValueTask<Activity> GetActivityById(Guid id)
    {
        return await _activityUseCase.ActivityRepository.GetById(id);
    }

    public async Task<IEnumerable<Activity>> GetAllActivities()
    {
        return await _activityUseCase.ActivityRepository.GetAll();
    }

    public async Task<Activity> CreateActivity(ActivityDto activityDto)
    {
        Activity activity = activityDto.CreateActivity();
        await _activityUseCase.ActivityRepository.Add(activity);
        await _activityUseCase.Commitment();
        return activity;
    }

    public async Task<Activity> UpdateActivity(Guid id, ActivityDto activityDto)
    {
        Activity activity = activityDto.CreateActivity();
        activity.Id = id;
        Activity activityToUpdate = await _activityUseCase.ActivityRepository.GetById(activity.Id);
        if (activity.ActivityName != null && activity.ActivityName != "")
        {
            activityToUpdate.ActivityName = activityDto.ActivityName;
        }
        if (activity.Price != null && activity.Price > 0)
        {
            activityToUpdate.Price = activity.Price;
        }
        await _activityUseCase.ActivityRepository.Update(activityToUpdate);
        await _activityUseCase.Commitment();
        return activity;
    }

    public async Task DeleteActivity(Guid id)
    {
        Activity activityToDelete = await _activityUseCase.ActivityRepository.GetById(id);
        _activityUseCase.ActivityRepository.Remove(activityToDelete);
        await _activityUseCase.Commitment();
    }
}
