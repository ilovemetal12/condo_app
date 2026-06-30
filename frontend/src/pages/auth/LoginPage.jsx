import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error?.message || t('auth.loginError');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('app-language', lng);
  };

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Top controls */}
        <Box sx={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 1, zIndex: 10 }}>
          <ToggleButtonGroup
            size="small"
            value={i18n.language}
            exclusive
            onChange={(e, val) => val && handleLanguageChange(val)}
            sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
          >
            <ToggleButton value="en" sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem' }}>EN</ToggleButton>
            <ToggleButton value="es" sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem' }}>ES</ToggleButton>
          </ToggleButtonGroup>
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
          >
            {mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
          </IconButton>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            maxWidth: 400,
            width: '100%',
            mx: 'auto',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {t('auth.loginTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth.loginSubtitle')}
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Fade in>
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
              placeholder={t('auth.emailPlaceholder')}
              size="medium"
            />
            <TextField
              fullWidth
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              placeholder={t('auth.passwordPlaceholder')}
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !email || !password}
              sx={{ mt: 3, py: 1.4 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : t('auth.loginButton')}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
          >
            {t('auth.secureAccess')}
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
}
