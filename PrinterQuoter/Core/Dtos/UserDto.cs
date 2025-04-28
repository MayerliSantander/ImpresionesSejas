using Core.Entities;

namespace Core.Dtos;

public class UserDto
{
    public Guid Id { get; set; }
    public string GoogleId { get; set; }
    public string Email {get; set;}
    public string UserName { get; set; }
    public User CreateUser()
    {
        User user = new User();
        user.Id = Guid.NewGuid();
        user.GoogleId = GoogleId;
        user.Email = Email;
        user.UserName = UserName;
        return user;
    }
}
