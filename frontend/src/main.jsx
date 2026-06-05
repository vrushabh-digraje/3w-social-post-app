import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';

// Create context for light/dark theme toggler
export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'dark' });

export const useColorMode = () => useContext(ColorModeContext);

function MainApp() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Sync index.css variables with theme mode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Generate theme dynamically based on light/dark mode selection
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#6366f1' : '#4f46e5', // Indigo
          },
          secondary: {
            main: mode === 'dark' ? '#ec4899' : '#db2777', // Pink
          },
          background: {
            default: mode === 'dark' ? '#020617' : '#f8fafc',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
            secondary: mode === 'dark' ? '#94a3b8' : '#475569',
          },
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
          button: {
            textTransform: 'none',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
