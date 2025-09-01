using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class UserService: IUserService
{
    private readonly IUserUseCase _userUseCase;

    public UserService(IUserUseCase userUseCase)
    {
        _userUseCase = userUseCase;
    }

    public async ValueTask<User> GetUserById(Guid id)
    {
        return await _userUseCase.UserRepository.GetById(id);
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _userUseCase.UserRepository.GetAll();
    }

    public async Task<User> CreateUser(UserDto userDto)
    {
        User user = userDto.CreateUser();
        await _userUseCase.UserRepository.Add(user);
        await _userUseCase.Commitment();
        return user;
    }

    public async Task<User> UpdateUser(Guid idUser, UserDto userDto)
    {
        User user = userDto.CreateUser();
        user.Id = idUser;
        User userToUpdate = await _userUseCase.UserRepository.GetById(user.Id);
        if (user.Email != null && user.Email != "")
        {
            userToUpdate.Email = user.Email;
        }
        if (user.UserName != null && user.UserName != "")
        {
            userToUpdate.UserName = user.UserName;
        }
        await _userUseCase.UserRepository.Update(userToUpdate);
        await _userUseCase.Commitment();
        return user;
    }

    public async Task UpdatePhoneAsync(Guid userId, string phone)
    {
        if (string.IsNullOrWhiteSpace(phone)) return;

        var u = await _userUseCase.UserRepository.GetById(userId);
        if (u == null) return;

        var normalized = phone.Trim();
        if (!string.IsNullOrWhiteSpace(normalized) && u.Phone != normalized)
        {
            u.Phone = normalized;
            await _userUseCase.UserRepository.Update(u);
            await _userUseCase.Commitment();
        }
    }
    
    public async Task DeleteUser(Guid userId)
    {
        User userToDelete = await _userUseCase.UserRepository.GetById(userId);
        _userUseCase.UserRepository.Remove(userToDelete);
        await _userUseCase.Commitment();
    }

    public async ValueTask<User> GetByGoogleId(string googleId)
    {
        IEnumerable<User> users = await _userUseCase.UserRepository.GetByGoogleId(googleId);
        return users.FirstOrDefault();
    }

    public async Task<User> LoginOrRegisterGoogleAsync(string googleId, string name, string email)
    {
        IEnumerable<User> users = await _userUseCase.UserRepository.GetByGoogleId(googleId);
        User user = users.FirstOrDefault();
        if (user == null)
        {
            var clientRole = await _userUseCase.RoleRepository.GetRoleByDescription("client");
            if (clientRole == null)
                throw new InvalidOperationException("Rol client no existe.");

            User newUser = new User
            {
                Id       = Guid.NewGuid(),
                GoogleId = googleId,
                UserName = name,
                Email    = email,
                Phone    = string.Empty,
                Roles    = new List<Role> { clientRole }
            };

            await _userUseCase.UserRepository.Add(newUser);
            await _userUseCase.Commitment();
            return newUser;
        }
        return user;
    }
}
