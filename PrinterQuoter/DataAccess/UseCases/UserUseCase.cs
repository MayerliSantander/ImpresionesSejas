using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class UserUseCase: BaseUseCase, IUserUseCase
{
    public UserUseCase(SqlContext context) : base(context) { }
    private IUserRepository _userRepository;
    private IRoleRepository _roleRepository;

    public IUserRepository GetUserRepository()
    {
        if (_userRepository == null){
            _userRepository = new UserRepository(_context);
        }
        return _userRepository;
    }
    
    public IRoleRepository GetRoleRepository()
    {
        if (_roleRepository == null){
            _roleRepository = new RoleRepository(_context);
        }
        return _roleRepository;
    }

    IUserRepository IUserUseCase.UserRepository => GetUserRepository();
    IRoleRepository IUserUseCase.RoleRepository => GetRoleRepository();
}
