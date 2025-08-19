import { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import usePagination from '../utils/usePagination';
import GenericButton from '../components/GenericButton';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { deleteMaterial, getMaterials } from '../services/materialService';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { updateInventoryByMaterialId } from '../services/inventoryService';
import UpdateInventoryModal from '../components/UpdateInventoryModal';
import '../styles/MaterialsPage.scss';

function useIsMobile(breakpoint = 576) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getMaterials();
        setMaterials(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error cargando materiales');
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const filtered = useMemo(
    () =>
      materials.filter(a =>
        a.materialName.toLowerCase().includes(search.toLowerCase())
      ),
    [materials, search]
  );

  const { currentData, page, totalPages, setPage } = usePagination(filtered, 5);

  const handleDeleteClick = item => {
    setToDelete(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMaterial(toDelete.id);
      setMaterials(prev => prev.filter(m => m.id !== toDelete.id));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setToDelete(null);
    }
  };

  if (loading) return <div className="container py-4">Cargando materiales…</div>;
  if (error) return <div className="container py-4 alert alert-danger">Error: {error}</div>;

  const columns = [
    {
      key: 'materialName',
      title: 'Material',
      render: item => (
        <div style={{ minWidth: 0 }}>
          <strong className="d-block">{item.materialName}</strong>
          <div className="text-muted" style={{ fontSize: '0.875rem', whiteSpace: 'normal' }}>
            {'Tamaño: ' + item.size} • {'Tipo: ' + item.type}
          </div>
        </div>
      )
    },
    {
      key: 'materialPrice',
      title: 'Precio',
      render: item => `${item.materialPrice} Bs`
    },
    {
      key: 'inventoryQuantity',
      title: 'Inventario',
      render: item => <span>{item.inventoryQuantity}</span>
    },
    {
      key: 'actionsInventory',
      title: 'Actualizar',
      render: item => (
        <GenericButton
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            setSelected(item);
            setShowUpdate(true);
          }}
        >
          Actualizar inventario
        </GenericButton>
      )
    }
  ];

  return (
    <>
      <div className="container py-4 materials-page">
        <div className="d-flex flex-row flex-wrap align-items-center justify-content-between mb-3">
          <GenericButton
            variant="light"
            circle
            icon={<FiArrowLeft />}
            onClick={() => navigate('/admin-home')}
            className="me-2"
          />
          <h2 className="h1-t flex-grow-1 m-0">Materiales</h2>
          <GenericButton
            variant="blue-primary"
            icon={<FiPlus />}
            iconPosition="right"
            onClick={() => navigate('new')}
          >
            Añadir
          </GenericButton>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        {!isMobile ? (
          <div className="table-wrap">
            <Table
              columns={columns}
              data={currentData}
              onEdit={item => navigate(`edit/${item.id}`)}
              onDelete={handleDeleteClick}
            />
          </div>
        ) : (
          <div className="row g-2">
            {currentData.map(item => (
              <div className="col-12" key={item.id}>
                <div className="card shadow-sm rounded-2xl">
                  <div className="card-body py-3">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{item.materialName}</div>
                        <div className="text-muted small">
                          Tamaño: {item.size} • Tipo: {item.type}
                        </div>
                        <div className="mt-2 d-flex flex-wrap gap-3 small">
                          <div><span className="text-secondary">Precio:</span> {item.materialPrice} Bs</div>
                          <div><span className="text-secondary">Inventario:</span> {item.inventoryQuantity}</div>
                        </div>
                      </div>
                      <div>
                        <GenericButton
                          className="btn-update-inventory"
                          variant="outline-secondary"
                          size="sm"
                          title="Actualizar Inventario"
                          onClick={() => { setSelected(item); setShowUpdate(true); }}
                        >
                          Actualizar Inventario
                        </GenericButton>
                      </div>
                    </div>

                    <div className="mt-2 d-flex gap-2">
                      <GenericButton
                        variant="outline-secondary"
                        size="sm"
                        aria-label="Editar"
                        title="Editar"
                        onClick={() => navigate(`edit/${item.id}`)}
                        icon={<FiEdit2 />}
                      />
                      <GenericButton
                        variant="outline-danger"
                        size="sm"
                        aria-label="Eliminar"
                        title="Eliminar"
                        onClick={() => handleDeleteClick(item)}
                        icon={<FiTrash2 />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Confirmar Eliminación"
        body={`¿Estás seguro de eliminar "${toDelete?.materialName}"?`}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
      />

      <UpdateInventoryModal
        show={showUpdate}
        material={selected}
        initialQuantity={selected ? Number(selected.inventoryQuantity ?? 0) : 0}
        onClose={() => setShowUpdate(false)}
        onError={(msg) => console.error(msg)}
        onSaved={async (newQty) => {
          await updateInventoryByMaterialId(selected.id, { quantity: newQty });
          setMaterials(prev =>
            prev.map(m => (m.id === selected.id ? { ...m, inventoryQuantity: newQty } : m))
          );
          setShowUpdate(false);
        }}
      />
    </>
  );
}
