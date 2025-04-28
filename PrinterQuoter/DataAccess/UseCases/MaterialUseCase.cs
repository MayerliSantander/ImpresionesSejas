using Core.Interfaces.Repositories;
using Core.Interfaces.UseCases;
using DataAccess.Repositories;

namespace DataAccess.UseCases;

public class MaterialUseCase : BaseUseCase, IMaterialUseCase
{
    public MaterialUseCase(SqlContext context) : base(context) { }
    private IMaterialRepository _materialRepository;

    public IMaterialRepository GetMaterialRepository()
    {
        if (_materialRepository == null){
            _materialRepository = new MaterialRepository(_context);
        }
        return _materialRepository;
    }

    IMaterialRepository IMaterialUseCase.MaterialRepository => GetMaterialRepository();
}
