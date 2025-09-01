import { percentOfTotal } from "../../utils/format";

function FunnelRow({ label, count, total }) {
  const percentage = percentOfTotal(count, total);
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between mb-1">
        <strong>{label}</strong>
        <span>{count ?? 0} ({percentage}%)</span>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function Funnel({ data }) {
  if (!data) return <div className="text-muted">Sin datos</div>;

  const expired = data.expiredCount ?? data.expired ?? 0;
  const waiting = data.waitingCount ?? data.waiting ?? 0;
  const orders  = data.ordersCount  ?? data.orders  ?? 0;

  const total = Number(expired) + Number(waiting) + Number(orders);

  return (
    <>
      <p className="text-muted small">
        Distribución de cotizaciones por estado dentro del rango seleccionado.
      </p>
      <FunnelRow label="Vencidas" count={expired} total={total} />
      <FunnelRow label="Esperando confirmación" count={waiting} total={total} />
      <FunnelRow label="Convertidas en órdenes" count={orders} total={total} />
    </>
  );
}
