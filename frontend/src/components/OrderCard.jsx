import { fmtDate, fmtMoney } from '../utils/format';
import GenericButton from './GenericButton';

export default function OrderCard({ order, onView, compact = false }) {
  const brief = (order.quotationDetails ?? [])
    .map(d => `${d.productName} (${d.quantity} Uds.)`)
    .join(', ');

  const statusClass = order.status === 'Confirmada'
    ? 'badge-status badge-status--success'
    : order.status === 'Pendiente'
    ? 'badge-status badge-status--warning'
    : 'badge-status';

  return (
    <div className="card quotation-card order-card">
      <div className={`card-body ${compact ? 'py-3' : ''}`}>
        <div className="row gy-3 align-items-start">
          <div className="col-12 col-md">
            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
              <h5 className="mb-0">
                Orden #{order.quotationNumber} &nbsp;
                <small className="text-body-secondary">| Cotización #{order.quotationNumber}</small>
              </h5>
              <span className={statusClass}>{order.status}</span>
            </div>

            <div className="meta-row small text-body-secondary mb-2">
              <div><span className="label">Confirmación:</span> {fmtDate(order.confirmationDate)}</div>
              <div><span className="label">Entrega:</span> {fmtDate(order.deliveryDate)}</div>
              <div><span className="label">Cliente:</span> {order.userName || ''}</div>
            </div>

            <div className="mt-1">
              <div className="fw-semibold">Productos</div>
              <div className="text-wrap">{brief || '—'}</div>
            </div>

            <div className="mt-2 fw-semibold">Total: {fmtMoney(order.totalPrice)}</div>
          </div>

          <div className="col-12 col-md-4 col-lg-3">
            <div className="d-grid d-sm-flex d-md-grid">
              <GenericButton
                variant="blue-primary"
                size="sm"
                className="w-100"
                onClick={onView}
              >
                Ver detalles
              </GenericButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
