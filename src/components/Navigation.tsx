import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as LinkIcon, BarChart } from '@mui/icons-material';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Toolbar>
          <LinkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              variant={location.pathname === '/' ? 'outlined' : 'text'}
              startIcon={<LinkIcon />}
            >
              Shorten URLs
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/stats"
              variant={location.pathname === '/stats' ? 'outlined' : 'text'}
              startIcon={<BarChart />}
            >
              Statistics
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
