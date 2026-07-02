import { createTheme } from '@mui/material/styles';

const common = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.6rem' },
    h5: { fontWeight: 700, fontSize: '1.3rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    body1: { fontSize: '0.9rem' },
    body2: { fontSize: '0.825rem' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 16px', boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12, boxShadow: 'none' } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 14 } },
    },
  },
};

export const lightTheme = createTheme({
  ...common,
  palette: {
    mode: 'light',
    primary: { main: '#4338ca' },
    secondary: { main: '#0f766e' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
    text: { primary: '#1a1a2e', secondary: '#5c6370' },
    divider: '#e4e7ec',
  },
});

export const darkTheme = createTheme({
  ...common,
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8' },
    secondary: { main: '#5eead4' },
    background: { default: '#0f1119', paper: '#1a1d2b' },
    text: { primary: '#e8eaed', secondary: '#9ca3af' },
    divider: '#2d3347',
  },
});
