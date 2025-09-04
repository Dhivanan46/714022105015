import React from 'react';
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { URLFormData, ValidationError } from '../types';

interface URLRowProps {
  index: number;
  data: URLFormData;
  errors: ValidationError[];
  onChange: (index: number, field: keyof URLFormData, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const URLRow: React.FC<URLRowProps> = ({
  index,
  data,
  errors,
  onChange,
  onRemove,
  canRemove
}) => {
  const getFieldError = (field: string) => {
    return errors.find(error => error.field === `${index}.${field}`)?.message;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            URL #{index + 1}
          </Typography>
          {canRemove && (
            <IconButton
              onClick={() => onRemove(index)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 2 }}>
            <TextField
              fullWidth
              label="Long URL *"
              placeholder="https://example.com/very/long/url"
              value={data.longUrl}
              onChange={(e) => onChange(index, 'longUrl', e.target.value)}
              error={!!getFieldError('longUrl')}
              helperText={getFieldError('longUrl') || 'Enter the URL you want to shorten'}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Validity (minutes)"
              type="number"
              placeholder="30"
              value={data.validity}
              onChange={(e) => onChange(index, 'validity', e.target.value)}
              error={!!getFieldError('validity')}
              helperText={getFieldError('validity') || 'Default: 30 minutes'}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Custom Code"
              placeholder="mycode123"
              value={data.customCode}
              onChange={(e) => onChange(index, 'customCode', e.target.value)}
              error={!!getFieldError('customCode')}
              helperText={getFieldError('customCode') || '3-20 alphanumeric chars'}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default URLRow;
