import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getQuotationById, requestQuotationConfirmation } from '../services/quotationService';
import GenericButton from '../components/GenericButton';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/QuotationDetail.scss'
import { getBadgeClass } from '../utils/quotes';

export default function QuotationDetailPage() {
  const { id } = useParams();
  const location = useLocation();
	const navigate = useNavigate();

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [banner, setBanner] = useState(null);
  const [autoRequested, setAutoRequested] = useState(false);

  const fetchQuotation = useCallback(async () => {
    setLoading(true);
    try {
      const q = await getQuotationById(id);
      setQuotation(q);
    } catch {
      alert('No se pudo cargar la cotización');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuotation();
  }, [fetchQuotation]);

  const mapBackendError = (err) => {
    const raw = err?.response?.data?.message || '';
    const msg = String(raw).toLowerCase();
    if (msg.includes('stock') || msg.includes('inventario') || msg.includes('insuficiente')) {
      return 'No hay suficiente stock para los productos de la cotización.';
    }
    if (msg.includes('expirado') || msg.includes('vencid')) {
      return 'La cotización ha expirado.';
    }
    if (msg.includes('solicitada') || msg.includes('confirm')) {
      return 'Esta cotización ya tiene una solicitud de confirmación.';
    }
    return raw || 'Ocurrió un error al solicitar la confirmación.';
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldRequest = params.get('request') === 'true';

    if (!shouldRequest || autoRequested || !quotation) return;

    const run = async () => {
      setAutoRequested(true);

      const blocked = ['Vencida', 'Confirmada', 'Esperando confirmación'];
      if (blocked.includes(quotation.status)) {
        setBanner({ type: 'error', text: 'No se puede solicitar confirmación para esta cotización.' });
        return;
      }

      try {
        setRequesting(true);
        await requestQuotationConfirmation(id);
        setBanner({ type: 'success', text: 'Confirmación solicitada. Estado: Esperando confirmación.' });
        await fetchQuotation();
      } catch (err) {
        setBanner({ type: 'error', text: mapBackendError(err) });
      } finally {
        setRequesting(false);
      }
    };

    run();
  }, [location.search, quotation, autoRequested, id, fetchQuotation]);

	const expirationDate = useMemo(() => {
    if (!quotation) return null;
    const d = new Date(quotation.date);
    d.setDate(d.getDate() + quotation.validityDays);
    return d;
  }, [quotation]);

	const formatDetailLine = (item) => {
    const parts = [];
    if (item.size) parts.push(`Tamaño ${item.size}`);
    if (item.materialName) parts.push(`en ${item.materialName}${item.paperWeight ? ` ${item.paperWeight}gr` : ''}`);
    if (Array.isArray(item.activities) && item.activities.length) {
      parts.push(item.activities.join(' '));
    }
    return parts.join(' ');
  };

  if (loading || !quotation) return <div className="container py-5">Cargando...</div>;

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
          disabled={requesting}
        />
        <h2>
          Detalle de Cotización <span className="text-body-secondary">#{quotation.quotationNumber}</span>
        </h2>
      </div>

      {banner && (
        <div className={`alert alert-${banner.type === 'success' ? 'success' : 'danger'} mt-3`} role="alert">
          {banner.text}
        </div>
      )}

      <div className="card mb-3">
				<div className="card-body">
					<div className="row gy-2">
						<div className="col-12 col-md-3">
							<strong>Fecha:</strong> {new Date(quotation.date).toLocaleDateString()}
						</div>
						<div className="col-12 col-md-3">
							<strong>Vence:</strong> {expirationDate?.toLocaleDateString()}
						</div>
						<div className="col-12 col-md-3">
							<strong>Validez:</strong> {quotation.validityDays} días
						</div>

						<div className="col-12 col-md-3 d-flex align-items-center gap-2">
							<strong>Estado:</strong>
							<span className={getBadgeClass(quotation.status)}>{quotation.status}</span>
						</div>
					</div>
				</div>
			</div>

      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">Productos</h5>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Cantidad</th>
                  <th className="text-end">Precio (Bs.)</th>
                </tr>
              </thead>
              <tbody>
                {quotation.quotationDetails.map((item, idx) => (
                  <tr key={idx}>
 										<td>
                      <div className="fw-semibold">{item.productName}</div>
                      <div className="detail-line">
                        {formatDetailLine(item)}
                      </div>
                    </td>                    
										<td className="text-end">{item.quantity.toLocaleString('es-BO')}</td>
                    <td className="text-end">{Number(item.price).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <div className="fw-bold">
              Total: Bs. {Number(quotation.totalPrice ?? 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
