import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  IconButton,
  Collapse,
  Alert,
  Tooltip,
  Link
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BarChart as ChartIcon,
  OpenInNew as OpenIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useLinks } from '../hooks/useLinks';
import { useNotification } from '../hooks/useNotification';
import { formatDate, getTimeRemaining, isExpired, copyToClipboard } from '../utils/validation';
import { Log } from '../../../Logging Middleware/logger.js';

const StatisticsPage: React.FC = () => {
  const { links, loading } = useLinks();
  const { showNotification } = useNotification();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    Log('frontend', 'debug', 'page', 'Statistics page rendered');
  }, []);

  const handleExpandRow = (code: string) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedRows(newExpanded);
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showNotification('Copied to clipboard!', 'success');
    } else {
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography>Loading...</Typography>
        </Paper>
      </Container>
    );
  }

  if (links.length === 0) {
    return (
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ChartIcon sx={{ mr: 2, fontSize: 32 }} color="primary" />
            <Typography variant="h4" component="h1">
              Statistics
            </Typography>
          </Box>
          <Alert severity="info">
            No shortened URLs found. <Link href="/">Create some URLs</Link> to see statistics here.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ px: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ChartIcon sx={{ mr: 2, fontSize: 32 }} color="primary" />
          <Typography variant="h4" component="h1">
            Statistics
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Overview of all your shortened URLs and their click analytics.
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Clicks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((link) => {
                const shortUrl = `${window.location.origin}/${link.code}`;
                const expired = isExpired(link.expiresAt);
                const timeRemaining = getTimeRemaining(link.expiresAt);
                const isRowExpanded = expandedRows.has(link.code);

                return (
                  <React.Fragment key={link.code}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace',
                              color: 'primary.main',
                              fontWeight: 'bold'
                            }}
                          >
                            {shortUrl}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(shortUrl)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                          {!expired && (
                            <IconButton
                              size="small"
                              onClick={() => handleOpenLink(shortUrl)}
                            >
                              <OpenIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Tooltip title={link.longUrl}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 300,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {link.longUrl}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(link.createdAt)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={expired ? 'Expired' : timeRemaining}
                          color={expired ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="h6" color="primary">
                          {link.clicks.length}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleExpandRow(link.code)}
                          disabled={link.clicks.length === 0}
                        >
                          {isRowExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {link.clicks.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0 }}>
                          <Collapse in={isRowExpanded}>
                            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                              <Typography variant="h6" gutterBottom>
                                Click Details ({link.clicks.length} total)
                              </Typography>
                              
                              <TableContainer>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Timestamp</TableCell>
                                      <TableCell>Source</TableCell>
                                      <TableCell>Location</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {link.clicks
                                      .sort((a, b) => b.timestamp - a.timestamp)
                                      .map((click, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          <Typography variant="body2">
                                            {formatDate(click.timestamp)}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body2">
                                            {click.source || 'Direct'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body2">
                                            {click.geo.city && click.geo.country
                                              ? `${click.geo.city}, ${click.geo.country}`
                                              : 'Unknown'
                                            }
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default StatisticsPage;
