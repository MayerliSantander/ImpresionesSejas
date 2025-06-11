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
