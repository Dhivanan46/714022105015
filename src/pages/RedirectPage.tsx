import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';
import { useLinks } from '../hooks/useLinks';
import { isExpired } from '../utils/validation';
import { recordClick } from '../utils/storage';
import { Log } from '../../../Logging Middleware/logger.js';

const RedirectPage: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const { links, findLinkByCode, setLinks, loading: linksLoading } = useLinks();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Don't proceed until links are loaded
    if (linksLoading) {
      return;
    }

    const doRedirect = async () => {
      if (!code) {
        setErrorMessage('No shortcode provided');
        setLoading(false);
        // best-effort log, don't block
        Log('frontend', 'error', 'page', 'Redirect attempted with no code');
        return;
      }

      // best-effort info log
      Log('frontend', 'info', 'page', `Redirect attempt for code: ${code}`);

      try {
        const link = findLinkByCode(code);

        if (!link) {
          setErrorMessage('This short link does not exist or has been removed.');
          setLoading(false);
          Log('frontend', 'warn', 'page', `Unknown code accessed: ${code}`);
          return;
        }

        if (isExpired(link.expiresAt)) {
          setErrorMessage('This short link has expired.');
          setLoading(false);
          Log('frontend', 'warn', 'page', `Expired code accessed: ${code}`);
          return;
        }

        // Redirect immediately and asynchronously record the click + log
        try {
          // fire-and-forget: record click and log without awaiting
          setTimeout(() => {
            // ignore promise result
            recordClick(code, links, setLinks).catch(() => {});
            Log('frontend', 'info', 'page', `Click recorded for code: ${code}`);
          }, 0);
        } catch (e) {
          // swallow; don't block redirect
        }

        // perform immediate redirect
        window.location.replace(link.longUrl);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(`Failed to process redirect: ${msg}`);
        setLoading(false);
        Log('frontend', 'error', 'page', `Redirect failed for code ${code}: ${msg}`);
      }
    };

    doRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, linksLoading]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Redirecting...</Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we redirect you to your destination.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ErrorIcon sx={{ fontSize: 64 }} color="error" />
        </Box>

        <Typography variant="h4" gutterBottom color="error">
          Oops! Link Not Found
        </Typography>

        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          {errorMessage ?? 'Unknown error'}
        </Alert>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The link you're trying to access might be expired, invalid, or removed.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" startIcon={<HomeIcon />} component={RouterLink} to="/">
            Create New Links
          </Button>

          <Button variant="outlined" startIcon={<StatsIcon />} component={RouterLink} to="/stats">
            View Statistics
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Shortcode: <code>{code}</code>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RedirectPage;
