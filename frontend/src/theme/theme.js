import { createTheme } from '@mui/material/styles';

const baseTypography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h4: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.75rem' },
  h5: { fontWeight: 700, letterSpacing: '-0.01em', fontSize: '1.4rem' },
  h6: { fontWeight: 600, fontSize: '1.1rem' },
  subtitle1: { fontWeight: 500 },
  body1: { fontSize: '0.925rem', lineHeight: 1.6 },
  body2: { fontSize: '0.85rem', lineHeight: 1.5 },
  button: { fontWeight: 600, fontSize: '0.875rem' },
};

const baseComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 8,
        padding: '9px 18px',
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
      },
      sizeSmall: { padding: '6px 12px', fontSize: '0.8rem' },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': { borderRadius: 8 },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '2px 0',
        padding: '8px 12px',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { border: 'none' },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: { boxShadow: 'none' },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { fontWeight: 500, borderRadius: 6 },
    },
  },
};

export function createAppTheme(mode) {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#4f46e5',
        light: '#818cf8',
        dark: '#3730a3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0891b2',
        light: '#22d3ee',
        dark: '#0e7490',
      },
      background: {
        default: isLight ? '#f9fafb' : '#0f1117',
        paper: isLight ? '#ffffff' : '#1a1d2e',
      },
      text: {
        primary: isLight ? '#111827' : '#f1f5f9',
        secondary: isLight ? '#6b7280' : '#94a3b8',
      },
      divider: isLight ? '#e5e7eb' : '#2d3348',
      success: { main: '#059669' },
      warning: { main: '#d97706' },
      error: { main: '#dc2626' },
    },
    typography: baseTypography,
    shape: { borderRadius: 8 },
    components: {
      ...baseComponents,
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: 'none',
            border: `1px solid ${isLight ? '#e5e7eb' : '#2d3348'}`,
          },
        },
      },
    },
  });
}
