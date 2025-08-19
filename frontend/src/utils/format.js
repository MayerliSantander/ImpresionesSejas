export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString() : '';

export const fmtMoney = (n) =>
  `Bs. ${Number(n ?? 0).toFixed(2)}`;
