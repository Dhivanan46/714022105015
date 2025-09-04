import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  Divider
} from '@mui/material';
import { Add as AddIcon, Link as LinkIcon } from '@mui/icons-material';
import URLRow from '../components/URLRow';
import ResultCard from '../components/ResultCard';
import { URLFormData, ValidationError, Link } from '../types';
import { validateURLForm, generateShortcode } from '../utils/validation';
import { useLinks } from '../hooks/useLinks';
import { useNotification } from '../hooks/useNotification';
import { Log } from '../../../Logging Middleware/logger.js';

const URLShortenerPage: React.FC = () => {
  const [urlData, setUrlData] = useState<URLFormData[]>([
    { longUrl: '', validity: '', customCode: '' }
  ]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<Array<{
    success: boolean;
    link?: Link;
    error?: string;
    originalUrl: string;
  }>>([]);

  const { addLink, isCodeUnique } = useLinks();
  const { showNotification } = useNotification();

  useEffect(() => {
    Log('frontend', 'info', 'page', 'URL Shortener page loaded');
  }, []);

  const handleFieldChange = (index: number, field: keyof URLFormData, value: string) => {
    const newData = [...urlData];
    newData[index] = { ...newData[index], [field]: value };
    setUrlData(newData);

    // Clear field-specific errors when user starts typing
    const fieldKey = `${index}.${field}`;
    setErrors(prev => prev.filter(error => error.field !== fieldKey));
  };

  const addRow = () => {
    if (urlData.length < 5) {
      setUrlData([...urlData, { longUrl: '', validity: '', customCode: '' }]);
      Log('frontend', 'debug', 'component', 'Added new URL row');
    }
  };

  const removeRow = (index: number) => {
    if (urlData.length > 1) {
      const newData = urlData.filter((_, i) => i !== index);
      setUrlData(newData);
      // Clear errors for removed row
      setErrors(prev => prev.filter(error => !error.field.startsWith(`${index}.`)));
      Log('frontend', 'debug', 'component', 'Removed URL row');
    }
  };

  const validateAllRows = (): boolean => {
    const allErrors: ValidationError[] = [];
    let hasData = false;

    urlData.forEach((data, index) => {
      // Check if row has any data
      if (data.longUrl.trim() || data.validity.trim() || data.customCode.trim()) {
        hasData = true;
        const rowErrors = validateURLForm(data);
        
        // Add index prefix to error fields
        rowErrors.forEach(error => {
          allErrors.push({
            ...error,
            field: `${index}.${error.field}`
          });
        });

        // Check custom code uniqueness
        if (data.customCode && !isCodeUnique(data.customCode)) {
          allErrors.push({
            field: `${index}.customCode`,
            message: 'This custom code is already in use'
          });
        }
      }
    });

    if (!hasData) {
      allErrors.push({
        field: 'general',
        message: 'Please enter at least one URL to shorten'
      });
    }

    setErrors(allErrors);
    return allErrors.length === 0;
  };

  const createLinks = async () => {
    if (!validateAllRows()) {
      Log('frontend', 'warn', 'component', 'Form validation failed');
      showNotification('Please fix the errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);
    const newResults: typeof results = [];

    try {
      for (let i = 0; i < urlData.length; i++) {
        const data = urlData[i];
        
        // Skip empty rows
        if (!data.longUrl.trim()) {
          continue;
        }

        try {
          // Generate or use custom code
          let code = data.customCode.trim();
          if (!code) {
            do {
              code = generateShortcode();
            } while (!isCodeUnique(code));
            Log('frontend', 'debug', 'utils', `Generated shortcode: ${code}`);
          }

          // Calculate expiry
          const validityMinutes = data.validity ? parseInt(data.validity, 10) : 30;
          const createdAt = Date.now();
          const expiresAt = createdAt + (validityMinutes * 60 * 1000);

          // Create link
          const link: Link = {
            code,
            longUrl: data.longUrl.trim(),
            createdAt,
            expiresAt,
            clicks: []
          };

          await addLink(link);
          
          newResults.push({
            success: true,
            link,
            originalUrl: data.longUrl.trim()
          });

          Log('frontend', 'info', 'state', `Link created: ${code} expires at ${new Date(expiresAt).toISOString()}`);

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create short link';
          newResults.push({
            success: false,
            error: errorMessage,
            originalUrl: data.longUrl.trim()
          });
          Log('frontend', 'error', 'component', `Failed to create link: ${errorMessage}`);
        }
      }

      setResults(newResults);
      
      // Reset form on success
      const successCount = newResults.filter(r => r.success).length;
      if (successCount > 0) {
        setUrlData([{ longUrl: '', validity: '', customCode: '' }]);
        showNotification(`Successfully created ${successCount} short link(s)!`, 'success');
      }

    } catch (error) {
      Log('frontend', 'error', 'component', 'Link creation process failed');
      showNotification('An error occurred while creating links', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generalError = errors.find(error => error.field === 'general');

  return (
    <Container maxWidth={false} sx={{ px: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LinkIcon sx={{ mr: 2, fontSize: 32 }} color="primary" />
          <Typography variant="h4" component="h1">
            URL Shortener
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter up to 5 URLs to shorten. Each link will be valid for 30 minutes by default.
        </Typography>

        {generalError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {generalError.message}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          {urlData.map((data, index) => (
            <URLRow
              key={index}
              index={index}
              data={data}
              errors={errors}
              onChange={handleFieldChange}
              onRemove={removeRow}
              canRemove={urlData.length > 1}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addRow}
            disabled={urlData.length >= 5}
          >
            Add URL ({urlData.length}/5)
          </Button>
          
          <Button
            variant="contained"
            size="large"
            onClick={createLinks}
            disabled={isSubmitting}
            sx={{ ml: 'auto' }}
          >
            {isSubmitting ? 'Creating...' : 'Shorten URLs'}
          </Button>
        </Box>

        {results.length > 0 && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Results
            </Typography>
            {results.map((result, index) => (
              <ResultCard
                key={index}
                result={result}
                index={index}
              />
            ))}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default URLShortenerPage;
