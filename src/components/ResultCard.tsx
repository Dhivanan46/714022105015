import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Alert
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { Link } from '../types';
import { formatDate, getTimeRemaining, copyToClipboard } from '../utils/validation';
import { useNotification } from '../hooks/useNotification';

interface ResultCardProps {
  result: {
    success: boolean;
    link?: Link;
    error?: string;
    originalUrl: string;
  };
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  const { showNotification } = useNotification();

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

  if (!result.success) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ErrorIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" color="error">
              URL #{index + 1} - Failed
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Original: {result.originalUrl}
          </Typography>
          <Alert severity="error">{result.error}</Alert>
        </CardContent>
      </Card>
    );
  }

  const { link } = result;
  if (!link) return null;

  const shortUrl = `${window.location.origin}/${link.code}`;
  const timeRemaining = getTimeRemaining(link.expiresAt);
  const isExpired = timeRemaining === 'Expired';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SuccessIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="h6" color="success.main">
            URL #{index + 1} - Success
          </Typography>
          <Chip
            label={isExpired ? 'Expired' : timeRemaining}
            color={isExpired ? 'error' : 'success'}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Original URL:
          </Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 1 }}>
            {link.longUrl}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Short URL:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ 
                wordBreak: 'break-all',
                flexGrow: 1,
                fontFamily: 'monospace'
              }}
            >
              {shortUrl}
            </Typography>
            <IconButton
              onClick={() => handleCopy(shortUrl)}
              size="small"
              color="primary"
            >
              <CopyIcon />
            </IconButton>
            <IconButton
              onClick={() => handleOpenLink(shortUrl)}
              size="small"
              color="primary"
            >
              <OpenIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Created: {formatDate(link.createdAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Expires: {formatDate(link.expiresAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
