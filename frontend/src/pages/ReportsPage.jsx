import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversion, getExpiring, getFunnel, getIdleItems, getKpis, getTopProducts } from '../services/reportService';
import GenericButton from '../components/GenericButton';
import ReportFilters from '../components/reports/ReportFilters';
import KpiCard from '../components/reports/KpiCard';
import { formatMoney, formatPct, formatDays1d, dateToYMDLocal } from '../utils/format';
import Funnel from '../components/reports/Funnel';
import ExpiringTable from '../components/reports/ExpiringTable';
import TopProductsTable from '../components/reports/TopProductsTable';
import IdleTable from '../components/reports/IdleTable';
import { FiArrowLeft } from 'react-icons/fi';

export default function ReportsPage() {
  const navigate = useNavigate();

  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return dateToYMDLocal(d);
  });
  const [to, setTo] = useState(() => dateToYMDLocal(new Date()));
  const [stockThreshold, setStockThreshold] = useState(5);
  const [topN, setTopN] = useState(10);

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [conv, setConv] = useState(null);
  const [expiring, setExpiring] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [idle, setIdle] = useState({ products: [], materials: [] });

  const reloadAll = async () => {
    setLoading(true);
    try {
      const [k, f, c, e, t, i] = await Promise.all([
        getKpis({ windowDays: 30, stockThreshold }),
        getFunnel({ from, to }),
        getConversion({ from, to }),
        getExpiring({ days: 3 }),
        getTopProducts({ from, to, top: topN }),
        getIdleItems({ from, to })
      ]);
      setKpis(k);
      setFunnel(f);
      setConv(c);
      setExpiring(e || []);
      setTopProducts(t || []);
      setIdle(i || { products: [], materials: [] });
    } catch (err) {
      console.error('Error cargando reportes:', err);
      alert('No se pudieron cargar los reportes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reloadAll(); }, []);

  const onApplyFilters = () => reloadAll();

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-3">
        <GenericButton
          variant="light"
          circle
          icon={<FiArrowLeft />}
          onClick={() => navigate('/admin-home')}
          className="me-2"
        />
        <h2 className="m-0">Dashboard de Reportes</h2>
      </div>

      <ReportFilters
        from={from}
        to={to}
        stockThreshold={stockThreshold}
        topN={topN}
        setFrom={setFrom}
        setTo={setTo}
        setStockThreshold={setStockThreshold}
        setTopN={setTopN}
        loading={loading}
        onApply={onApplyFilters}
      />

      <div className="row g-3 mb-3">
        <KpiCard
          title="Cotizaciones creadas hoy"
          value={kpis?.quotationsToday ?? '-'}
          subtitle="Total generado hoy."
        />
        <KpiCard
          title="Conversión (últimos 30 días)"
          value={formatPct(kpis?.conversion30dPct)}
          subtitle="Cotizaciones que terminaron en Orden / Cotizaciones creadas."
        />
        <KpiCard
          title="Ingresos confirmados (últimos 30 días)"
          value={formatMoney(kpis?.amountConfirmed30d)}
          subtitle="Suma del Total (Bs) de cotizaciones confirmadas."
        />
        <KpiCard
          title="Cotizaciones que vencen en ≤ 3 días"
          value={kpis?.toExpireIn3d ?? '-'}
          subtitle="Solo cotizaciones vigentes."
        />
        <KpiCard
          title={`Stock crítico (≤ ${stockThreshold})`}
          value={kpis?.criticalStock ?? '-'}
          subtitle="Materiales con existencias por debajo del umbral."
        />
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="mb-2">Estado de cotizaciones en el período</h5>
          <Funnel data={funnel} />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="mb-2">Tasa de conversión</h5>
              <div className="display-6">{formatPct(conv?.conversionPct)}</div>
              <div className="text-muted small">Porcentaje de cotizaciones del rango que pasaron a <strong>Orden</strong>.</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="mb-2">Tiempo promedio a confirmación</h5>
              <div className="display-6">
                {conv?.avgDaysToConfirm != null
                  ? formatDays1d(conv.avgDaysToConfirm)
                  : '-'}
              </div>
              <div className="text-muted small">Días promedio desde cotizar hasta confirmar dentro del período.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="mb-2">Próximas a vencer (≤ 3 días)</h5>
              <ExpiringTable rows={expiring} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="mb-2">Top productos por ingresos</h5>
              <TopProductsTable rows={topProducts} />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="mb-2">Ítems sin movimiento en el período</h5>
              <IdleTable products={idle.products} materials={idle.materials} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
