import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericButton from '../components/GenericButton';
import Spinner from 'react-bootstrap/Spinner';
import { getUserQuotations, requestQuotationConfirmation, updateQuotationStatus } from '../services/quotationService';
import '../styles/QuotationList.scss'
import '../styles/_badges.scss'
import QuoteCard from '../components/QuoteCard';
import { shouldAutoExpire } from '../utils/quotes';

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

    (async () => {
      try {
        const fetched = await getUserQuotations(userId);

        const toExpire = fetched.filter(q => shouldAutoExpire(q));

        if (toExpire.length > 0) {
          await Promise.allSettled(toExpire.map(q => updateQuotationStatus(q.id)));
          const refreshed = await getUserQuotations(userId);
          setQuotations(refreshed);
        } else {
          setQuotations(fetched);
        }
      } catch (err) {
        console.error('Error al obtener cotizaciones:', err);
      } finally {
        setLoading(false);
      }
    })();
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
          {quotations.map(q => {
            const msg = cardMsg[q.id];
            const isLoading = loadingId === q.id;
            const canRequest = q.status !== 'Vencida' && q.status !== 'Confirmada' && q.status !== 'Esperando confirmación' && !isLoading;

            return (
              <div key={q.id} className="col-12">
                <QuoteCard
                  quote={q}
                  message={msg}
                  onView={() => navigate(`/home/quotes/${q.id}`)}
                  primaryAction={{
                    label: isLoading ? <Spinner animation="border" size="sm" /> : 'Solicitar confirmación',
                    onClick: () => handleRequestConfirmation(q.id),
                    disabled: !canRequest,
                    loading: isLoading
                  }}
                  footer={
                    <small className="text-body-secondary">
                      ¿Dudas? Contáctanos al {SUPPORT_PHONE}
                    </small>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
