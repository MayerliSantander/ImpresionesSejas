using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Services;

public interface IUserService
{
    ValueTask<User> GetUserById(Guid id);
    Task<IEnumerable<User>> GetAllUsers();
    Task<User> CreateUser(UserDto userDto);
    Task<User> UpdateUser(Guid idUser, UserDto userDto);
    Task DeleteUser(Guid userId);
    ValueTask<User> GetByGoogleId(string googleId);
    Task<User> LoginOrRegisterGoogleAsync(string googleId, string name, string email);
}
