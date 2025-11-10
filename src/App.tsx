import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { useEffect } from 'react';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import ThemeToggle from './components/ThemeToggle';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B9D',
      light: '#FF8FB3',
      dark: '#FF3D7A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9B59B6',
      light: '#BB8FCE',
      dark: '#7D3C98',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA', // Light theme default, will be overridden by CSS
      paper: '#FFFFFF', // Light theme default, will be overridden by CSS
    },
    text: {
      primary: '#1A1F3A', // Light theme default, will be overridden by CSS
      secondary: '#4A5568', // Light theme default, will be overridden by CSS
    },
    error: {
      main: '#FF4757',
    },
    warning: {
      main: '#FFA502',
    },
    info: {
      main: '#00D2FF',
    },
    success: {
      main: '#00FF88',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #FF6B9D 0%, #9B59B6 50%, #00D2FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-primary)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 20px 40px var(--shadow-glow), 0 0 20px var(--shadow-accent)`,
            border: '1px solid var(--border-hover)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'var(--border-secondary)',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: 'var(--border-hover)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--border-focus)',
              boxShadow: '0 0 20px var(--shadow-glow)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 30px var(--shadow-glow)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--text-secondary)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--accent-primary)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 15px var(--shadow-glow)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px var(--shadow-glow-hover)',
          },
        },
        contained: {
          background: 'var(--gradient-primary)',
          '&:hover': {
            background: 'var(--gradient-primary-hover)',
          },
        },
        outlined: {
          borderColor: 'var(--accent-primary)',
          color: 'var(--accent-primary)',
          '&:hover': {
            borderColor: 'var(--accent-primary-light)',
            backgroundColor: 'var(--bg-hover)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'var(--gradient-paper)',
          border: '1px solid var(--border-primary)',
          boxShadow: `0 8px 32px var(--shadow-md), 0 0 20px var(--shadow-glow)`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'var(--bg-active)',
          border: '1px solid var(--border-secondary)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'var(--bg-hover-secondary)',
            transform: 'scale(1.05)',
            boxShadow: '0 4px 15px var(--shadow-glow)',
          },
        },
      },
    },
  },
});

function App() {
  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemPreference;
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 8, sm: 12, md: 16 },
          right: { xs: 8, sm: 12, md: 16 },
          zIndex: 1000,
        }}
      >
        <ThemeToggle />
      </Box>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/anime/:id" element={<DetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

