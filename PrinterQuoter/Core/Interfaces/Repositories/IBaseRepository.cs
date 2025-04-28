namespace Core.Interfaces.Repositories;

public interface IBaseRepository<TEntity> where TEntity : class
{
     ValueTask<TEntity> GetById(Guid id);
     Task<IEnumerable<TEntity>> GetAll();
     Task Add(TEntity entity);
     Task Update(TEntity entity);
     void Remove(TEntity entity);
}
