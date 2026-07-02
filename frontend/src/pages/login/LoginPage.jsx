import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, TextField, Button, Typography, Alert, CircularProgress, IconButton, InputAdornment, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Visibility, VisibilityOff, DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function LoginPage() {
  const { login } = useAuth();
  const { mode, toggle } = useTheme();
  const nav = useNavigate();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      nav('/');
    } catch {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  const changeLang = (_, v) => { if (v) { i18n.changeLanguage(v); localStorage.setItem('lang', v); } };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      {/* Top-right controls */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 1 }}>
        <ToggleButtonGroup size="small" exclusive value={i18n.language} onChange={changeLang}>
          <ToggleButton value="en" sx={{ px: 1, py: 0.3, fontSize: '0.7rem' }}>EN</ToggleButton>
          <ToggleButton value="es" sx={{ px: 1, py: 0.3, fontSize: '0.7rem' }}>ES</ToggleButton>
        </ToggleButtonGroup>
        <IconButton size="small" onClick={toggle}>
          {mode === 'light' ? <DarkModeRounded fontSize="small" /> : <LightModeRounded fontSize="small" />}
        </IconButton>
      </Box>

      <Paper sx={{ p: 4, width: '100%', maxWidth: 380, border: 1, borderColor: 'divider' }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>{t('login.title')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{t('login.subtitle')}</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label={t('login.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          <TextField
            label={t('login.password')} type={showPw ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} required
            InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading || !email || !password} sx={{ mt: 1 }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : t('login.button')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
