using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Services;

public interface IActivityService
{
    ValueTask<Activity> GetActivityById(Guid id);
    Task<IEnumerable<Activity>> GetAllActivities();
    Task<Activity> CreateActivity(ActivityDto activityDto);
    Task<Activity> UpdateActivity(Guid id, ActivityDto activityDto);
    Task DeleteActivity(Guid activityId);
}
