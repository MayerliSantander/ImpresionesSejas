import { getBadgeClass, getExpiration, productsBrief } from "../utils/quotes";
import GenericButton from "./GenericButton";

export default function QuoteCard({
  quote,
  onView,
  primaryAction,
  secondaryAction,
  message,
  rightCol,
  footer,
  compact = false
}) {
  const exp = getExpiration(quote.date, quote.validityDays);
  const brief = productsBrief(quote.quotationDetails || []);

  return (
    <div className="card quotation-card">
      <div className={`card-body ${compact ? 'py-3' : ''}`}>
        <div className="row gy-3 align-items-start">
          <div className="col-12 col-md">
            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
              <h5 className="mb-0">Cotización #{quote.quotationNumber}</h5>
              <span className={getBadgeClass(quote.status)}>{quote.status}</span>
            </div>

            <div className="meta-row small text-body-secondary mb-2">
              <div><span className="label">Fecha:</span> {new Date(quote.date).toLocaleDateString()}</div>
              <div><span className="label">Vence:</span> {exp.toLocaleDateString()}</div>
              <div><span className="label">Validez:</span> {quote.validityDays} días</div>
            </div>

            <div className="mt-1">
              <div className="fw-semibold">Productos</div>
              <div className="text-wrap">{brief}</div>
            </div>

            <div className="mt-2 fw-semibold">
              Total: Bs. {Number(quote.totalPrice ?? 0).toFixed(2)}
            </div>

            {message && (
              <div className={`card-inline-message ${message.type} mt-2`} role="alert">
                {message.text}
              </div>
            )}

            {footer ? <div className="mt-2">{footer}</div> : null}
          </div>

          <div className="col-12 col-md-4 col-lg-3">
            {rightCol ? (
              rightCol
            ) : (
              <div className="d-grid d-sm-flex d-md-grid">
                <GenericButton
                  variant="blue-primary"
                  size="sm"
                  className="w-100"
                  onClick={onView}
                >
                  Ver detalles
                </GenericButton>

                {primaryAction && (
                  <GenericButton
                    variant="blue-primary"
                    size="sm"
                    className="w-100"
                    onClick={primaryAction.onClick}
                    disabled={!!primaryAction.disabled}
                  >
                    {primaryAction.loading ? '...' : primaryAction.label}
                  </GenericButton>
                )}

                {secondaryAction && (
                  <GenericButton
                    variant="secondary"
                    size="sm"
                    className="w-100"
                    onClick={secondaryAction.onClick}
                    disabled={!!secondaryAction.disabled}
                  >
                    {secondaryAction.loading ? '...' : secondaryAction.label}
                  </GenericButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
