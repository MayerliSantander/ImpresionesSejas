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

export async function getMaterials() {
  const response = await api.get('/Material');
  return response.data;
}

export async function getMaterialById(id) {
  const response = await api.get(`/Material/${id}`);
  return response.data;
}

export async function createMaterial(materialDto) {
  const response = await api.post('/Material', materialDto);
  return response.data;
}

export async function updateMaterial(id, materialDto) {
  const response = await api.put(`/Material/${id}`, materialDto);
  return response.data;
}

export async function deleteMaterial(id) {
  await api.delete(`/Material/${id}`);
}
