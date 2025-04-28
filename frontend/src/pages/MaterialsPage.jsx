import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import usePagination from '../utils/usePagination';
import GenericButton from '../components/GenericButton';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { deleteMaterial, getMaterials } from '../services/materialService';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

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
    () => materials.filter(a =>
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

  if (loading) return <div>Cargando materiales…</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  const columns = [
    {
      key: 'materialName',
      title: 'Material',
      render: item => (
        <div>
          <strong>{item.materialName}</strong>
          <div className="text-muted" style={{ fontSize: '0.875rem' }}>
            {'Tamaño: ' + item.size} • {'Tipo: ' + item.type}
          </div>
        </div>
      )
    },
    {
      key: 'materialPrice',
      title: 'Precio',
      render: item => `${item.materialPrice} Bs`
    }
  ];

  return (
    <>
      <div className="container py-4">
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
            variant='blue-primary' 
            icon={<FiPlus />} 
            iconPosition="right"
            onClick={() => navigate('new')}
          >
            Añadir
          </GenericButton>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <Table
          columns={columns}
          data={currentData}
          onEdit={item => navigate(`edit/${item.id}`)}
          onDelete={handleDeleteClick}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
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
    </>
  );
}
