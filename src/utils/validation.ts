import { ValidationError } from '../types';

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Custom shortcode validation
export const isValidShortcode = (code: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(code) && code.length >= 3 && code.length <= 20;
};

// Validity (minutes) validation
export const isValidMinutes = (minutes: string): boolean => {
  if (!minutes) return true; // Optional field
  const num = parseInt(minutes, 10);
  return !isNaN(num) && num > 0;
};

// Validate URL form data
export const validateURLForm = (formData: {
  longUrl: string;
  validity: string;
  customCode: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Long URL validation
  if (!formData.longUrl.trim()) {
    errors.push({ field: 'longUrl', message: 'URL is required' });
  } else if (!isValidUrl(formData.longUrl)) {
    errors.push({ field: 'longUrl', message: 'Please enter a valid URL' });
  }

  // Validity validation
  if (formData.validity && !isValidMinutes(formData.validity)) {
    errors.push({ field: 'validity', message: 'Validity must be a positive integer (minutes)' });
  }

  // Custom code validation
  if (formData.customCode && !isValidShortcode(formData.customCode)) {
    errors.push({ 
      field: 'customCode', 
      message: 'Custom code must be 3-20 alphanumeric characters' 
    });
  }

  return errors;
};

// Generate random shortcode
export const generateShortcode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// Check if link is expired
export const isExpired = (expiresAt: number): boolean => {
  return Date.now() > expiresAt;
};

// Get time remaining
export const getTimeRemaining = (expiresAt: number): string => {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return 'Expired';
  
  const minutes = Math.floor(remaining / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};
