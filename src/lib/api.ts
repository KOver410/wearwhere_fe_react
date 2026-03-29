import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const firebaseToken = await user.getIdToken(true);
          await api.post('/auth/refresh-token', { firebaseToken });
          // Cookie updated, retry original request
          return api(originalRequest);
        }
      } catch {
        // Refresh failed — let AuthContext handle redirect
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
