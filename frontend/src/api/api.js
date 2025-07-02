import axios from 'axios';

const api = axios.create({
    baseURL: 'http://pets-detection-segmentation-web-application-production.up.railway.app',
});

// authentication apis
export const register = (userData) => api.post('/api/auth/register', userData);
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const verifyToken = (token) => api.get('/api/auth/verify', {
    headers: { Authorization: `Bearer ${token}` }
});

export default api;