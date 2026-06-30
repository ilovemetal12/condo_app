import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ApartmentRounded,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

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
      const message = err.response?.data?.error?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          maxWidth: 420,
          mx: 'auto',
        }}
      >
        {/* Logo / Brand */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <ApartmentRounded sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            CondoSaaS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Residential community management
          </Typography>
        </Box>

        {/* Error alert */}
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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
            placeholder="you@company.com"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            placeholder="Enter your password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            sx={{ mt: 3, py: 1.5 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          Secure access for authorized personnel only
        </Typography>
      </Paper>
    </Fade>
  );
}
