import GenericButton from '../GenericButton';

export default function ReportFilters({
  from, to, stockThreshold, topN,
  setFrom, setTo, setStockThreshold, setTopN,
  loading, onApply
}) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-3">
            <label className="form-label">Desde</label>
            <input
              type="date"
              className="form-control"
              value={from || ''}
              onChange={e => setFrom(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Hasta</label>
            <input
              type="date"
              className="form-control"
              value={to || ''}
              onChange={e => setTo(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Stock crítico ≤</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={stockThreshold}
              onChange={e => setStockThreshold(Number(e.target.value || 0))}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Top productos</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={topN}
              onChange={e => setTopN(Number(e.target.value || 10))}
            />
          </div>
          <div className="col-12 text-end">
            <GenericButton
              variant="blue-primary"
              onClick={onApply}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Aplicar filtros'}
            </GenericButton>
          </div>
        </div>
      </div>
    </div>
  );
}
