import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Snackbar, Alert } from '@mui/material';
import Navigation from './components/Navigation';
import URLShortenerPage from './pages/URLShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectPage';
import { useNotification } from './hooks/useNotification';
import { initializeLogger, Log } from '../../Logging Middleware/logger.js';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#dc143c', // Cherry red
    },
    secondary: {
      main: '#8b0000', // Dark red
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(220, 20, 60, 0.1)', // Light cherry red hover
            color: '#dc143c', // Cherry red text on hover
          },
          '&:focus': {
            color: '#dc143c', // Cherry red text on focus
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(220, 20, 60, 0.1)',
            color: '#dc143c',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(220, 20, 60, 0.1)',
            borderColor: '#dc143c',
            color: '#dc143c',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          '& .MuiButton-root': {
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
            },
          },
        },
      },
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Log('frontend', 'fatal', 'component', `Application error: ${error.message}`);
    console.error('Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>The application encountered an unexpected error.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Notification Provider Component
const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notification, hideNotification } = useNotification();

  return (
    <>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Main App Component
const App: React.FC = () => {
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize logger with placeholder credentials
        // In a real app, these would come from environment variables or config
        await initializeLogger('demo-client-id', 'demo-client-secret');
        await Log('frontend', 'info', 'config', 'App boot on /');
      } catch (error) {
        console.warn('Logger initialization failed, continuing without remote logging');
      }
    };

    initApp();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <NotificationProvider>
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', width: '100%' }}>
              <Routes>
                {/* Redirect routes don't show navigation */}
                <Route path="/:code" element={<RedirectPage />} />
                
                {/* Main app routes with navigation */}
                <Route path="/*" element={
                  <>
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<URLShortenerPage />} />
                      <Route path="/stats" element={<StatisticsPage />} />
                    </Routes>
                  </>
                } />
              </Routes>
            </div>
          </NotificationProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
