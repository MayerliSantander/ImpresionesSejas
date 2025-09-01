import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || ''
});

api.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
    config.headers['Authorization'] = token;
	}
	return config;
});

function dstr(d) {
  if (!d) return '';
  if (typeof d === 'string') return d;
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function getKpis({ windowDays = 30, stockThreshold = 5 }) {
  const { data } = await api.get('/Reports/kpis', { params: { windowDays, stockThreshold }});
  return data;
}

export async function getFunnel({ from, to }) {
  const { data } = await api.get('/Reports/funnel', { params: { from: dstr(from), to: dstr(to) }});
  return {
    expiredCount: data.expired ?? data.expiredCount ?? 0,
    waitingCount: data.waiting ?? data.waitingCount ?? 0,
    ordersCount:  data.orders  ?? data.ordersCount  ?? 0,
  };
}

export async function getConversion({ from, to }) {
  const { data } = await api.get('/Reports/conversion', { params: { from: dstr(from), to: dstr(to) }});
  return {
    quotations: data.quotations ?? 0,
    confirmed:  data.confirmed  ?? 0,
    conversionPct: data.conversionPct ?? 0,
    avgDaysToConfirm: data.avgDaysToConfirm ?? data.averageDaysConfirmation ?? null,
  };
}

export async function getExpiring({ days = 3 }) {
  const { data } = await api.get('/Reports/expiring', { params: { days }});
  return data || [];
}

export async function getTopProducts({ from, to, top = 10 }) {
  const { data } = await api.get('/Reports/top-products', { params: { from: dstr(from), to: dstr(to), limit: top }});
  return (data || []).map(x => ({
    productName: x.productName,
    ordersCount: x.ordersCount ?? x.units ?? 0,
    totalAmount: x.totalAmount ?? x.income ?? 0,
  }));
}

export async function getIdleItems({ from, to }) {
  const { data } = await api.get('/Reports/idle-items', { params: { from: dstr(from), to: dstr(to) }});
  return {
    products: (data?.products || []).map(p =>
      typeof p === 'string'
        ? { productId: undefined, productName: p, category: undefined }
        : {
            productId: p.productId ?? p.id,
            productName: p.productName ?? p.name,
            category: p.category ?? undefined
          }
    ),
    materials: (data?.materials || []).map(m =>
      typeof m === 'string'
        ? { materialId: undefined, materialName: m, materialType: undefined }
        : {
            materialId: m.materialId ?? m.id,
            materialName: m.materialName ?? m.name,
            materialType: m.materialType ?? m.type ?? undefined
          }
    ),
  };
}
