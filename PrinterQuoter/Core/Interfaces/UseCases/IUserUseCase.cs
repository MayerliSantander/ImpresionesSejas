using Core.Interfaces.Repositories;

namespace Core.Interfaces.UseCases;

public interface IUserUseCase: IBaseUseCase
{
    IUserRepository UserRepository { get; }
    IRoleRepository RoleRepository { get; }
}
