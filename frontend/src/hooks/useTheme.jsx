import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { lightTheme, darkTheme } from '../theme';

const ThemeCtx = createContext();

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => { localStorage.setItem('theme', mode); }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeCtx.Provider value={{ mode, toggle, theme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
