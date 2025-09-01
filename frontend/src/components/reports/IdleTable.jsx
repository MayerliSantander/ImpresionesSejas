export default function IdleTable({ products, materials }) {
  const p = products || [];
  const m = materials || [];
  const empty = p.length === 0 && m.length === 0;
  if (empty) return <div className="text-muted">Sin ítems sin movimiento en el período.</div>;

  return (
    <div className="row">
      <div className="col-12 col-lg-6">
        <h6>Productos sin órdenes (confirmadas)</h6>
        {p.length === 0 ? (
          <div className="text-muted">Ninguno.</div>
        ) : (
          <ul className="mb-3">
            {p.map((x, i) => (
              <li key={x.productId ?? i}>
                {x.productName}
                {x.category ? ` — ${x.category}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-12 col-lg-6">
        <h6>Materiales sin consumo</h6>
        {m.length === 0 ? (
          <div className="text-muted">Ninguno.</div>
        ) : (
          <ul className="mb-3">
            {m.map((x, i) => (
              <li key={x.materialId ?? i}>
                {x.materialName}
                {x.materialType ? ` (${x.materialType})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
