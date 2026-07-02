import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setReady(true); return; }
    api.get('/auth/me')
      .then((r) => setUser(r.data.data))
      .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('refresh'); })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.data.accessToken);
    localStorage.setItem('refresh', data.data.refreshToken);
    setUser(data.data.user);
  }, []);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('refresh');
    try { await api.post('/auth/logout', { refreshToken: refresh }); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
