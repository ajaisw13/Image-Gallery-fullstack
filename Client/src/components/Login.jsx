import React, { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';

const FIREBASE_ERRORS = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/popup-closed-by-user': '',
};

function getErrorMessage(code) {
  return FIREBASE_ERRORS[code] || 'Something went wrong. Please try again.';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const msg = getErrorMessage(err.code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'reset') {
        await resetPassword(email);
        setInfo('Password reset email sent. Check your inbox.');
        setMode('signin');
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setInfo('');
    setPassword('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          color: 'white',
          py: 4,
          textAlign: 'center',
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Image Gallery
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
          Upload, search, and explore your photos
        </Typography>
      </Box>

      {/* Card */}
      <Paper
        elevation={3}
        sx={{
          mt: 6,
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          mx: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 52, height: 52, mb: 1.5 }}>
            <CollectionsIcon />
          </Avatar>
          <Typography variant="h6">
            {mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Reset password' : 'Sign in'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {mode === 'signup'
              ? 'Join to access the gallery'
              : mode === 'reset'
              ? 'Enter your email to receive a reset link'
              : 'Sign in to access your gallery'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {info && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {info}
          </Alert>
        )}

        {/* Google button — only on sign-in / sign-up modes */}
        {mode !== 'reset' && (
          <>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={loading}
              startIcon={
                <Box
                  component="img"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  sx={{ width: 20, height: 20 }}
                />
              }
              sx={{ py: 1.2, mb: 2, borderColor: 'divider', color: 'text.primary' }}
            >
              Continue with Google
            </Button>

            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                or
              </Typography>
            </Divider>
          </>
        )}

        {/* Email form */}
        <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="text"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="small"
            autoComplete="email"
          />

          {mode !== 'reset' && (
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              size="small"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ py: 1.2 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : mode === 'signup' ? (
              'Create account'
            ) : mode === 'reset' ? (
              'Send reset email'
            ) : (
              'Sign in'
            )}
          </Button>
        </Box>

        {/* Footer links */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          {mode === 'signin' && (
            <>
              <Button size="small" onClick={() => switchMode('reset')} sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                Forgot password?
              </Button>
              <Typography variant="body2" color="text.secondary">
                No account?{' '}
                <Button size="small" onClick={() => switchMode('signup')} sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline', fontWeight: 600 }}>
                  Sign up
                </Button>
              </Typography>
            </>
          )}
          {(mode === 'signup' || mode === 'reset') && (
            <Typography variant="body2" color="text.secondary">
              <Button size="small" onClick={() => switchMode('signin')} sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline', fontWeight: 600 }}>
                Back to sign in
              </Button>
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
