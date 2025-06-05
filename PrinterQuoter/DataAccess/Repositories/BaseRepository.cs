using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public abstract class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class {
    private readonly SqlContext _context;
    protected DbSet<TEntity> dbSet;

    public BaseRepository(SqlContext context)
    {
        _context = context;
        dbSet = _context.Set<TEntity>();
    }

    public virtual async ValueTask<TEntity> GetById(Guid id)
    {
        return await dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<TEntity>> GetAll()
    {
        return await dbSet.ToListAsync();
    }

    public virtual async Task Add(TEntity entity)
    {
        await dbSet.AddAsync(entity);
    }

    public virtual async Task Update(TEntity entity)
    {
        dbSet.Update(entity);
    }

    public virtual void Remove(TEntity entity)
    {
        dbSet.Remove(entity);
    }
}
