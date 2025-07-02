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

export async function uploadTemplate(formData) {
  const response = await api.post('/Template/Upload', formData);
	return response.data;
}

export async function getCurrentTemplate() {
  const response = await api.get('/Template/Current');
  return response.data;
}
