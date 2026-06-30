import api from './api';

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
}

export async function getProfile() {
  const response = await api.get('/auth/me');
  return response.data.data;
}

export async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    await api.post('/auth/logout', { refreshToken });
  } catch {
    // Ignore logout errors
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
