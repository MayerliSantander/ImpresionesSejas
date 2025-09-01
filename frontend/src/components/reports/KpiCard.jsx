export default function KpiCard({ title, value, subtitle }) {
  return (
    <div className="col-12 col-md-6 col-lg-3">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <div className="text-muted">{title}</div>
          <div className="display-6 mt-1">{value}</div>
          {subtitle && <div className="text-muted small mt-2">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}
