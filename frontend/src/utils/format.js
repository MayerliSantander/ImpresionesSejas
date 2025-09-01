export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString() : '';

export const fmtMoney = (n) =>
  `Bs. ${Number(n ?? 0).toFixed(2)}`;

export function dateToYMDLocal(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatMoney(n) {
  if (n == null) return '-';
  return Number(n).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPct(v) {
  if (v == null) return '-';
  return `${Number(v).toFixed(0)}%`;
}

export function formatDays1d(v) {
  if (v == null) return '-';
  return `${Number(v).toFixed(1)} días`;
}

export function percentOfTotal(n, total) {
  const t = Number(total) || 0;
  const v = Number(n) || 0;
  if (t <= 0) return 0;
  return Math.round((v / t) * 100);
}
