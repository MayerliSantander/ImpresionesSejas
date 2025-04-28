import axios from 'axios';

export async function verifyToken(Token) {
	const api = axios.create({
		baseURL: import.meta.env.VITE_API_BASE || '',
		headers:
		{
			'Authorization': Token
		}
	});
  const response = await api.post('/Authentication/Login');
  return response.data;
}
