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

export async function updateInventoryByMaterialId(materialId, inventoryDto) {
  const response = await api.put(`/Inventory/material/${materialId}`, inventoryDto);
  return response.data;
}
