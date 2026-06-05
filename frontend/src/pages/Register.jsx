import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  BubbleChart as BubbleChartIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const result = await register(username.trim(), email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Box
        className="glass-panel fade-in"
        sx={{
          width: '100%',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <BubbleChartIcon sx={{ fontSize: 40, color: '#6366f1' }} />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '.5px' }}>
            3W Social
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, textAlign: 'center' }}>
          Join us today to start sharing posts with others
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2.5, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={submitting}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#f8fafc',
                borderRadius: '8px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#f8fafc',
                borderRadius: '8px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#f8fafc',
                borderRadius: '8px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
            }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={submitting}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: '#94a3b8' }}
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#f8fafc',
                borderRadius: '8px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={submitting}
            className="glow-button"
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '8px',
            }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign Up'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
