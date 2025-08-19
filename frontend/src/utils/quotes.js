export function getBadgeClass(status) {
  switch (status) {
    case 'Pendiente': return 'badge-status badge-status--warning';
    case 'Esperando confirmación': return 'badge-status badge-status--info';
    case 'Confirmada': return 'badge-status badge-status--success';
    case 'Vencida': return 'badge-status badge-status--danger';
    default: return 'badge-status';
  }
}

export function getExpiration(dateStr, validityDays) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + validityDays);
  return d;
}

export function productsBrief(details = []) {
  return details.map(d => `${d.productName} (${d.quantity} Uds.)`).join(', ');
}
