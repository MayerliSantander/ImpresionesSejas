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

export async function getProducts() {
  const response = await api.get('/Product');
  return response.data;
}

export async function getProductById(id) {
  const response = await api.get(`/Product/${id}`);
  return response.data;
}

export async function createProduct(productDto) {
  const response = await api.post('/Product', productDto);
  return response.data;
}

export async function updateProduct(id, productDto) {
  const response = await api.put(`/Product/${id}`, productDto);
  return response.data;
}

export async function deleteProduct(id) {
  await api.delete(`/Product/${id}`);
}
