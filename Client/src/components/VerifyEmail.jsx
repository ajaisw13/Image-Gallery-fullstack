import React, { useState } from 'react';
import { Alert, Avatar, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmail() {
  const { currentUser, resendVerificationEmail, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await resendVerificationEmail();
      setSent(true);
    } catch {
      setError('Failed to resend. Please wait a moment and try again.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerified = () => window.location.reload();

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

      <Paper
        elevation={3}
        sx={{ mt: 6, p: 4, width: '100%', maxWidth: 420, borderRadius: 3, mx: 2, textAlign: 'center' }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
          <MarkEmailUnreadIcon />
        </Avatar>

        <Typography variant="h6" gutterBottom>
          Verify your email
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We sent a verification link to{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {currentUser?.email}
          </Box>
          . Click the link in the email to activate your account.
        </Typography>

        {sent && (
          <Alert severity="success" sx={{ mb: 2, textAlign: 'left' }}>
            Verification email resent. Check your inbox.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleCheckVerified}
          sx={{ mb: 1.5 }}
        >
          I've verified my email
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleResend}
          disabled={resending || sent}
          startIcon={resending ? <CircularProgress size={16} /> : null}
          sx={{ mb: 1.5 }}
        >
          {resending ? 'Sending...' : 'Resend verification email'}
        </Button>

        <Button fullWidth size="small" onClick={logout} sx={{ color: 'text.secondary' }}>
          Sign out
        </Button>
      </Paper>
    </Box>
  );
}
