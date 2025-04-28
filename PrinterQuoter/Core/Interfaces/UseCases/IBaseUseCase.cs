namespace Core.Interfaces.UseCases;

public interface IBaseUseCase : IDisposable
{
    Task<int> Commitment();
}
