using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class {
    private readonly SqlContext _context;
    protected DbSet<TEntity> dbSet;

    public BaseRepository(SqlContext context)
    {
        _context = context;
        dbSet = _context.Set<TEntity>();
    }

    public async ValueTask<TEntity> GetById(Guid id)
    {
        return await dbSet.FindAsync(id);
    }

    public async Task<IEnumerable<TEntity>> GetAll()
    {
        return await dbSet.ToListAsync();
    }

    public async Task Add(TEntity entity)
    {
        await dbSet.AddAsync(entity);
    }

    public async Task Update(TEntity entity)
    {
        dbSet.Update(entity);
    }

    public void Remove(TEntity entity)
    {
        dbSet.Remove(entity);
    }
}
