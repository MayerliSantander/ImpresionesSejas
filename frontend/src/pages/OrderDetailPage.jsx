import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GenericButton from '../components/GenericButton';
import { fmtDate, fmtMoney } from '../utils/format';
import { getOrderById } from '../services/orderService';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Orders.scss'
import '../styles/_badges.scss'
import { getBadgeClass } from '../utils/quotes';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (e) {
        console.error('No se pudo cargar la orden', e);
        alert('No se pudo cargar la orden');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="container py-5 text-center">Cargando orden...</div>;
  if (!order) return <div className="container py-5 text-center">Orden no encontrada.</div>;

  const items = order.quotationDetails ?? [];
  const itemsTotal = items.reduce((acc, it) => acc + Number(it.price ?? 0), 0);

  return (
    <div className="container py-4">
			<div className="detail-header">
				<GenericButton
					onClick={() => navigate(-1)}
					icon={<FaArrowLeft />}
					variant="light"
					size="sm"
					circle
					className="back-button"
				/>
				<h2>
          Orden <span className="text-body-secondary">#{order.quotationNumber}</span>
        </h2>
			</div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row gy-2">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong>Estado:</strong>
                <span className={getBadgeClass(order.status)}>{order.status}</span>
              </div>
              <div><strong>Cliente:</strong> {order.userName}</div>
              <div><strong>Cotización #:</strong> {order.quotationNumber}</div>
            </div>
            <div className="col-12 col-md-6">
              <div><strong>Confirmación:</strong> {fmtDate(order.confirmationDate)}</div>
              <div><strong>Entrega:</strong> {fmtDate(order.deliveryDate)}</div>
              <div><strong>Total:</strong> {fmtMoney(order.totalPrice)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">Detalle de productos</h5>

          <div className="table-stacked">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Cantidad</th>
                  <th>Material</th>
                  <th>Actividades</th>
                  <th className="text-end">Importe</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td data-label="Producto">{it.productName}</td>
                    <td data-label="Cantidad" className="text-end">{it.quantity}</td>
                    <td data-label="Material">{it.materialName || '—'}</td>
                    <td data-label="Actividades">
                      <div className="d-flex flex-wrap gap-1">
                        {(it.activities ?? []).map((a, i) => (
                          <span key={i} className="chip">{a}</span>
                        ))}
                      </div>
                    </td>
                    <td data-label="Importe" className="text-end">{fmtMoney(it.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4} className="text-end">Subtotal</th>
                  <th className="text-end">{fmtMoney(itemsTotal)}</th>
                </tr>
                <tr>
                  <th colSpan={4} className="text-end">Total</th>
                  <th className="text-end">{fmtMoney(order.totalPrice)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
