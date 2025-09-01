import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/Tabs.scss';
import '../styles/_badges.scss'
import { confirmQuotation, getAllQuotations, getPendingConfirmations, updateQuotationStatus } from '../services/quotationService';
import { getOrders } from '../services/orderService';
import QuoteCard from '../components/QuoteCard';
import OrderCard from '../components/OrderCard';
import { FiArrowLeft } from 'react-icons/fi';
import GenericButton from '../components/GenericButton';
import { shouldAutoExpire } from '../utils/quotes';

function mapBackendError(err) {
  const raw = err?.response?.data?.message || '';
  const msg = String(raw).toLowerCase();
  if (msg.includes('stock') || msg.includes('inventario') || msg.includes('insuficiente')) {
    return 'No hay suficiente stock para los productos de la cotización.';
  }
  if (msg.includes('expirado') || msg.includes('vencid')) return 'La cotización ha expirado.';
  if (msg.includes('solicitada') || msg.includes('confirm')) return 'Esta cotización ya tiene una solicitud de confirmación.';
  return raw || 'Ocurrió un error al confirmar la cotización.';
}

async function refreshExpiredQuotes(quotes) {
  const toExpire = quotes.filter(q => shouldAutoExpire(q));
  if (toExpire.length === 0) return false;

  await Promise.allSettled(toExpire.map(q => updateQuotationStatus(q.id)));
  return true;
}


export default function AdminQuotesAndOrdersPage() {
  const navigate = useNavigate();

  const TABS = ['Solicitudes de confirmación', 'Todas las cotizaciones', 'Órdenes'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const [pending, setPending] = useState([]);
  const [allQuotes, setAllQuotes] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [cardMsg, setCardMsg] = useState({});

  const setMsg = (id, type, text) => setCardMsg(prev => ({ ...prev, [id]: { type, text } }));
  const clearMsg = (id) => setCardMsg(prev => { const c = { ...prev }; delete c[id]; return c; });

  const loadPending = async () => {
    const data = await getPendingConfirmations();
    const changed = await refreshExpiredQuotes(data);
    setPending(changed ? await getPendingConfirmations() : data);
  };
  const loadAllQuotes = async () => {
    const data = await getAllQuotations();
    const changed = await refreshExpiredQuotes(data);
    setAllQuotes(changed ? await getAllQuotations() : data);
  };
  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        if (activeTab === TABS[0]) {
          await loadPending();
        } else if (activeTab === TABS[1]) {
          await loadAllQuotes();
        } else {
          await loadOrders();
        }
      } catch (e) {
        console.error('Error cargando tab:', e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { };
  }, [activeTab]);

  const handleConfirm = async (quotationId, scope) => {
    try {
      setLoadingId(quotationId);
      clearMsg(quotationId);

      const updated = await confirmQuotation(quotationId);

      if (scope === 'pending') {
        setPending(prev => prev.filter(x => x.id !== quotationId));
      }

      setAllQuotes(prev => prev.map(x => (x.id === updated.id ? { ...x, ...updated } : x)));

      if (scope === 'pending' && activeTab === TABS[0]) await loadPending();
      await loadOrders();

    } catch (err) {
      setMsg(quotationId, 'error', mapBackendError(err));
    } finally {
      setLoadingId(null);
    }
  };

  const PendingTab = useMemo(() => (
    <div className="row g-3">
      {pending.length === 0 ? (
        <p className="text-muted">No hay solicitudes pendientes de confirmación.</p>
      ) : pending.map((q) => {
          const msg = cardMsg[q.id];
          const isLoading = loadingId === q.id;
          const canConfirm = q.status === 'Esperando confirmación' && !isLoading;

          return (
            <div key={q.id} className="col-12">
              <QuoteCard
                quote={q}
                message={msg}
                onView={() => navigate(`/admin-home/quotes/${q.id}`)}
                primaryAction={{
                  label: isLoading ? <Spinner animation="border" size="sm" /> : 'Confirmar',
                  onClick: () => handleConfirm(q.id, 'pending'),
                  disabled: !canConfirm,
                  loading: isLoading
                }}
              />
            </div>
          );
      })}
    </div>
  ), [pending, loadingId, cardMsg, navigate]);

  const AllQuotesTab = useMemo(() => (
    <div className="row g-3">
      {allQuotes.length === 0 ? (
        <p className="text-muted">No hay cotizaciones registradas.</p>
      ) : allQuotes.map((q) => {
          const msg = cardMsg[q.id];
          const isLoading = loadingId === q.id;
          const canConfirm = q.status === 'Esperando confirmación' && !isLoading;

          return (
            <div key={q.id} className="col-12">
              <QuoteCard
                quote={q}
                message={msg}
                onView={() => navigate(`/admin-home/quotes/${q.id}`)}
                primaryAction={{
                  label: isLoading ? <Spinner animation="border" size="sm" /> : 'Confirmar',
                  onClick: () => handleConfirm(q.id, 'all'),
                  disabled: !canConfirm,
                  loading: isLoading
                }}
              />
            </div>
          );
      })}
    </div>
  ), [allQuotes, loadingId, cardMsg, navigate]);

  const OrdersTab = useMemo(() => (
    <div className="row g-3">
      {orders.length === 0 ? (
        <p className="text-muted">No hay órdenes registradas.</p>
      ) : orders.map((o) => (
        <div key={o.id} className="col-12">
          <OrderCard
            order={o}
            onView={() => navigate(`/admin-home/orders/${o.id}`)}
          />
        </div>
      ))}
    </div>
  ), [orders, navigate]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center">
        <GenericButton
          variant="light"
          circle
          icon={<FiArrowLeft />}
          onClick={() => navigate('/admin-home')}
          className="me-2"
        />
        <h2 className="m-0" >Cotizaciones y Órdenes</h2>
      </div>

      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-5 text-center">Cargando...</div>
      ) : (
        <div className="mt-3">
          {activeTab === TABS[0] && PendingTab}
          {activeTab === TABS[1] && AllQuotesTab}
          {activeTab === TABS[2] && OrdersTab}
        </div>
      )}
    </div>
  );
}
