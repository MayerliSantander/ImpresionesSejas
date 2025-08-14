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

export async function sendQuotation(quotationDto) {
  const response = await api.post('/Quotation/Send', quotationDto);
  return response.data;
}

export async function getUserQuotations(userId) {
  const response = await api.get(`/Quotation/user/${userId}`);
  return response.data;
}

export async function getQuotationById(quotationId) {
  const response = await api.get(`/Quotation/${quotationId}`);
  return response.data;
}

export async function requestQuotationConfirmation(quotationId) {
  const response = await api.put(`/Quotation/request-confirmation/${quotationId}`);
  return response.data;
}

export async function updateQuotationStatus(quotationId) {
  const response = await api.put(`/Quotation/update-status/${quotationId}`);
  return response.data;
};
