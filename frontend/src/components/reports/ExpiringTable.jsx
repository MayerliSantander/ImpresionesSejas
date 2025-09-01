export default function ExpiringTable({ rows }) {
  if (!rows || rows.length === 0) return <div className="text-muted">Sin cotizaciones próximas a vencer.</div>;
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Vence</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((q) => {
            const date = new Date(q.date).toLocaleDateString();
            const exp = new Date(q.date); exp.setDate(exp.getDate() + q.validityDays);
            return (
              <tr key={q.id}>
                <td>{q.quotationNumber}</td>
                <td>{q.userName || q.user?.userName || '-'}</td>
                <td>{date}</td>
                <td>{exp.toLocaleDateString()}</td>
                <td>{q.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-muted small mt-2">Solo se muestran cotizaciones vigentes que vencerán en los próximos días.</div>
    </div>
  );
}
