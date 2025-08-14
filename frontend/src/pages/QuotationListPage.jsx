import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericButton from '../components/GenericButton';
import Spinner from 'react-bootstrap/Spinner';
import { getUserQuotations, requestQuotationConfirmation, updateQuotationStatus } from '../services/quotationService';
import '../styles/QuotationList.scss'

const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE;

export default function QuotationListPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
	const [cardMsg, setCardMsg] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'undefined') {
      alert('Inicia sesión nuevamente.');
      navigate('/');
      return;
    }

    getUserQuotations(userId)
      .then(async (fetchedQuotations) => {
        for (let quotation of fetchedQuotations) {
          const expirationDate = new Date(quotation.date);
          expirationDate.setDate(expirationDate.getDate() + quotation.validityDays);
          const isExpired = expirationDate < new Date();
          
          if (isExpired && quotation.status !== 'Vencida') {
            await updateQuotationStatus(quotation.id);
          }
        }
        setQuotations(fetchedQuotations);
      })
      .catch((err) => {
        console.error('Error al obtener cotizaciones:', err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

	const setMsg = (id, type, text) => setCardMsg(prev => ({ ...prev, [id]: { type, text } }));
  const clearMsg = (id) => setCardMsg(prev => { const c = { ...prev }; delete c[id]; return c; });

	const mapBackendError = (err) => {
    const raw = err?.response?.data?.message || '';
  	const msg = String(raw).toLowerCase();

  	if (msg.includes('stock') || msg.includes('inventario') || msg.includes('insuficiente')) {
      return `No hay suficiente stock para los productos de la cotización. Contáctanos al ${SUPPORT_PHONE} para verificar disponibilidad.`;
    }
    if (msg.includes('expirado') || msg.includes('vencid')) {
      return 'La cotización ha expirado.';
    }
    if (msg.includes('solicitada')|| msg.includes('confirm')) {
      return 'Esta cotización ya tiene una solicitud de confirmación.';
    }
    return raw || 'Ocurrió un error al solicitar la confirmación.';
  };

  const handleRequestConfirmation = async (quotationId) => {
    try {
      setLoadingId(quotationId);
			clearMsg(quotationId);

      await requestQuotationConfirmation(quotationId);

      const userId = localStorage.getItem('userId');
      const updatedQuotations = await getUserQuotations(userId);

      setQuotations(updatedQuotations);

    } catch (err) {
      setMsg(quotationId, 'error', mapBackendError(err));
    } finally {
      setLoadingId(null);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'badge-status badge-status--warning';
      case 'Esperando confirmación':
        return 'badge-status badge-status--info';
      case 'Confirmada':
        return 'badge-status badge-status--success';
      case 'Vencida':
        return 'badge-status badge-status--danger';
      default:
        return 'badge-status';
    }
  };

  if (loading) return <div className="container py-5 text-center">Cargando cotizaciones...</div>;

  return (
    <div className="container container-quotations py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Mis Cotizaciones</h2>
      </div>

      {quotations.length === 0 ? (
        <p className="text-muted">No tienes cotizaciones registradas.</p>
      ) : (
        <div className="row g-3">
          {quotations.map((q) => {
            const expirationDate = new Date(q.date);
            expirationDate.setDate(expirationDate.getDate() + q.validityDays);

            const productsBrief = q.quotationDetails
              .map(d => `${d.productName} (${d.quantity} Uds.)`)
              .join(', ');

						const msg = cardMsg[q.id];

            return (
              <div key={q.id} className="col-12">
                <div className="card quotation-card">
                  <div className="card-body">
                    <div className="row gy-3 align-items-start">
                      <div className="col-12 col-md">
                        <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                          <h5 className="mb-0">Cotización #{q.quotationNumber}</h5>
                          <span className={getBadgeClass(q.status)}>{q.status}</span>
                        </div>
                        <div className="meta-row small text-body-secondary mb-2">
                          <div><span className="label">Fecha:</span> {new Date(q.date).toLocaleDateString()}</div>
                          <div><span className="label">Vence:</span> {expirationDate.toLocaleDateString()}</div>
                          <div><span className="label">Validez:</span> {q.validityDays} días</div>
                        </div>

                        <div className="mt-1">
                          <div className="fw-semibold">Productos</div>
                          <div className="text-wrap">{productsBrief}</div>
                        </div>

                        <div className="mt-2 fw-semibold">
                          Total: Bs. {q.totalPrice.toFixed(2)}
                        </div>

												{msg && (
                          <div className={`card-inline-message ${msg.type} mt-2`} role="alert">
                            {msg.text}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-4 col-lg-3">
                        <div className="d-grid d-sm-flex d-md-grid">
                          <GenericButton
                            variant="blue-primary"
                            size="sm"
														className="w-100"
                            onClick={() => navigate(`/home/quotes/${q.id}`)}
                          >
                            Ver detalles
                          </GenericButton>

                          <GenericButton
                            variant="blue-primary"
                            size="sm"
														className="w-100"
                            onClick={() => handleRequestConfirmation(q.id)}
                            disabled={q.status === 'Vencida' || q.status === 'Confirmada' || q.status === 'Esperando confirmación' || loadingId === q.id}
                          >
                            {loadingId === q.id ? <Spinner animation="border" size="sm" /> : 'Solicitar confirmación'}
                          </GenericButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
