import { formatMoney } from "../../utils/format";

export default function TopProductsTable({ rows }) {
  if (!rows || rows.length === 0) return <div className="text-muted">Sin ventas confirmadas en el rango.</div>;
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th className="text-end">Órdenes</th>
            <th className="text-end">Ingresos (Bs.)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.productId ?? r.productName ?? i}>
              <td>{r.productName}</td>
              <td className="text-end">{r.ordersCount ?? r.units ?? 0}</td>
              <td className="text-end">{formatMoney(r.totalAmount ?? r.income)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-muted small mt-2">Incluye únicamente cotizaciones confirmadas dentro del período.</div>
    </div>
  );
}
