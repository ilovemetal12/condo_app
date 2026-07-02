import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const { data } = await axios.post(
            (import.meta.env.VITE_API_URL || '/api') + '/auth/refresh',
            { refreshToken: refresh }
          );
          localStorage.setItem('token', data.data.accessToken);
          localStorage.setItem('refresh', data.data.refreshToken);
          orig.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(orig);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
