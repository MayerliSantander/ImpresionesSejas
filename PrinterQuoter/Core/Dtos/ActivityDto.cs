using Core.Entities;

namespace Core.Dtos;

public class ActivityDto
{
    public string ActivityName { get; set; }
    public double Price { get; set; }

    public Activity CreateActivity()
    {
        Activity activity = new Activity();
        activity.Id = Guid.NewGuid();
        activity.ActivityName = ActivityName;
        activity.Price = Price;
        return activity;
    }
}
