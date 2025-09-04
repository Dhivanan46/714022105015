import { Link, Click } from '../types';

const STORAGE_KEY = 'url_shortener_data';

// Get geo information (mock implementation for demo)
export const getGeoInfo = async (): Promise<{ country?: string; region?: string; city?: string }> => {
  try {
    // In a real app, you would use a geolocation service
    // For demo purposes, we'll return mock data
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name,
        region: data.region,
        city: data.city
      };
    }
  } catch (error) {
    // Fallback to mock data if the service fails
  }
  
  return {
    country: 'Unknown',
    region: 'Unknown', 
    city: 'Unknown'
  };
};

// Local storage utilities
export const saveLinks = (links: Link[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadLinks = (): Link[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return [];
  }
};

// Record a click for analytics
export const recordClick = async (code: string, links: Link[], setLinks: (links: Link[]) => void): Promise<void> => {
  const linkIndex = links.findIndex(link => link.code === code);
  if (linkIndex === -1) return;

  const geo = await getGeoInfo();
  const click: Click = {
    timestamp: Date.now(),
    source: document.referrer || 'direct',
    geo
  };

  const updatedLinks = [...links];
  updatedLinks[linkIndex] = {
    ...updatedLinks[linkIndex],
    clicks: [...updatedLinks[linkIndex].clicks, click]
  };

  setLinks(updatedLinks);
  saveLinks(updatedLinks);
};
