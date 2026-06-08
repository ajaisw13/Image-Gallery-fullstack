import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ImageGallery from './components/ImageGallery';
import Login from './components/Login';
import VerifyEmail from './components/VerifyEmail';
import theme from './theme';

function App() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Login />;
  if (!currentUser.emailVerified) return <VerifyEmail />;
  return <ImageGallery />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
