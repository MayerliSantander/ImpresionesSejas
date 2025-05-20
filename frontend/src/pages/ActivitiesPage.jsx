import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import usePagination from '../utils/usePagination';
import GenericButton from '../components/GenericButton';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { deleteActivity, getActivities } from '../services/activityService';

export default function ActivitiesPage() {
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error cargando actividades');
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, []);

  const filtered = useMemo(
    () => activities.filter(a =>
      a.activityName.toLowerCase().includes(search.toLowerCase())
    ),
    [activities, search]
  );

  const { currentData, page, totalPages, setPage } = usePagination(filtered, 5);

  const handleDeleteClick = item => {
    setToDelete(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteActivity(toDelete.id);
      setActivities(prev => prev.filter(a => a.id !== toDelete.id));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setToDelete(null);
    }
  };

  if (loading) return <div>Cargando actividades...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  const columns = [
    {
      key: 'activityName',
      title: 'Activity',
      render: item => (
        <div>
          {item.activityName}
        </div>
      )
    },
    {
      key: 'price',
      title: 'Precio',
      render: item => `${item.price} Bs`
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
          <h2 className="h1-t flex-grow-1 m-0">Actividades</h2>
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
        body={`¿Estás seguro de eliminar "${toDelete?.activityName}"?`}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
      />
    </>
  );
}
