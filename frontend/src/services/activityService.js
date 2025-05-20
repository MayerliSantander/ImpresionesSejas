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

export async function getActivities() {
  const response = await api.get('/Activity');
  return response.data;
}

export async function getActivityById(id) {
  const response = await api.get(`/Activity/${id}`);
  return response.data;
}

export async function createActivity(activityDto) {
  const response = await api.post('/Activity', activityDto);
  return response.data;
}

export async function updateActivity(id, activityDto) {
  const response = await api.put(`/Activity/${id}`, activityDto);
  return response.data;
}

export async function deleteActivity(id) {
  await api.delete(`/Activity/${id}`);
}
