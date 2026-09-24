import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Tab,
  Tabs,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../assets/logo.svg';

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const COLORS = {
  primary: '#0F766E',
  secondary: '#06B6D4',
  bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};



function Auth({ onLoginSuccess }) {
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(username)) {
      newErrors.username = 'Username must be 3+ chars, alphanumeric, underscores, or hyphens';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Show success message
      setSuccess('✅ Account created successfully! Redirecting to login in 2 seconds...');
      
      // Reset form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});

      // Redirect to login after 2 seconds
      setTimeout(() => {
        setTab(0);
        setSuccess('');
      }, 2000);
    } catch {
      setError('Network error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/login`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Call success callback with user data
      onLoginSuccess(data.user);

    } catch {
      setError('Network error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (e, value) => {
    setTab(value);
    setError('');
    setSuccess('');
    setErrors({});
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Box
      className="auth-shell"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth={false} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Card
          className="auth-card"
          sx={{
            width: '100%',
            maxWidth: 960,
            minWidth: 0,
            flex: '1 1 100%',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          }}
        >
          <Box
            className="auth-brand-panel"
            sx={{
              p: 3,
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 4 }}>
              <Box
                component="img"
                src={logo}
                alt="AI Study Planner logo"
                sx={{ width: 52, height: 52, display: 'block' }}
              />
              <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mb: 0,
                textAlign: 'left',
              }}
            >
              📚 AI Study Planner
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
              }}
            >
              Plan with clarity. Learn with momentum.
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, mt: 4, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.72)', lineHeight: 1.7 }}>
                Build a realistic study rhythm, keep every session visible, and turn ambitious goals into the next clear action.
              </Typography>
            </Box>
          </Box>

          <CardContent className="auth-form-panel" sx={{ p: 4 }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                '& .MuiTabs-indicator': {
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  height: 3,
                },
              }}
            >
              <Tab
                label="Log in"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'capitalize',
                  color: tab === 0 ? COLORS.primary : '#94A3B8',
                }}
              />
              <Tab
                label="Create account"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'capitalize',
                  color: tab === 1 ? COLORS.primary : '#94A3B8',
                }}
              />
            </Tabs>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                {success}
              </Alert>
            )}

            {tab === 0 ? (
              // LOGIN FORM
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        👤
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your username"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        🔒
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your password"
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: 2,
                    textTransform: 'capitalize',
                    '&:hover': {
                      boxShadow: `0 8px 24px rgba(15, 118, 110, 0.3)`,
                    },
                  }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            ) : (
              // REGISTER FORM
              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username || 'Min 3 chars, alphanumeric, underscores, or hyphens'}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        👤
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Choose a username"
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        📧
                      </InputAdornment>
                    ),
                  }}
                  placeholder="your.email@example.com"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password || 'Min 6 characters'}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        🔒
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Create a password"
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        🔐
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Confirm your password"
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: 2,
                    textTransform: 'capitalize',
                    '&:hover': {
                      boxShadow: `0 8px 24px rgba(15, 118, 110, 0.3)`,
                    },
                  }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            )}

            <Box sx={{ mt: 3, p: 2, background: '#F0F9FF', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: '#475569' }}>
                💡 <strong>Demo Credentials:</strong> Use username "demo" and password "123456"!
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            display: 'block',
            mt: 3,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          🔐 Your data is secure and encrypted
        </Typography>
      </Container>
    </Box>
  );
}

export default Auth;
