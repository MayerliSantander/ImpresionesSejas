import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import usePagination from '../utils/usePagination';
import GenericButton from '../components/GenericButton';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { deleteProduct, getProducts } from '../services/productService';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Error cargando productos');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filtered = useMemo(
    () => products.filter(p =>
      p.productName.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  );

  const { currentData, page, totalPages, setPage } = usePagination(filtered, 5);

  const handleDeleteClick = item => {
    setToDelete(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(toDelete.id);
      setProducts(prev => prev.filter(p => p.id !== toDelete.id));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setToDelete(null);
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  const columns = [
    {
      key: 'productName',
      title: 'Producto',
      render: item => item.productName
    },
    {
      key: 'minQuantity',
      title: 'Cant. Min.',
      render: item => `${item.minimumQuantity}`
    }
  ];

  return (
    <>
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <GenericButton
            variant="light"
            circle
            icon={<FiArrowLeft />}
            onClick={() => navigate('/admin-home')}
            className="me-2"
          />
          <h2 className="h1-t flex-grow-1 m-0">Productos</h2>
          <GenericButton 
            variant='blue-primary' 
            icon={<FiPlus />} 
            iconPosition="right"
            onClick={() => navigate('new')}
          >
            Añadir
          </GenericButton>
        </div>

        <SearchBar value={search} onChange={setSearch} />

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
        body={`¿Estás seguro de eliminar "${toDelete?.productName}"?`}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
      />
    </>
  );
}
