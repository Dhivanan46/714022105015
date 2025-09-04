import { useState, useEffect } from 'react';
import { Link } from '../types';
import { loadLinks, saveLinks } from '../utils/storage';
import { Log } from '../../../Logging Middleware/logger.js';

export const useLinks = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLinks = loadLinks();
        setLinks(savedLinks);
        await Log('frontend', 'debug', 'hook', `Loaded ${savedLinks.length} links from storage`);
      } catch (error) {
        await Log('frontend', 'error', 'hook', 'Failed to load links from storage');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addLink = async (link: Link) => {
    const newLinks = [...links, link];
    setLinks(newLinks);
    saveLinks(newLinks);
    await Log('frontend', 'info', 'state', `Link created with code: ${link.code}`);
  };

  const updateLinks = async (updatedLinks: Link[]) => {
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
    await Log('frontend', 'debug', 'state', 'Links updated');
  };

  const findLinkByCode = (code: string): Link | undefined => {
    return links.find(link => link.code === code);
  };

  const isCodeUnique = (code: string): boolean => {
    return !links.some(link => link.code === code);
  };

  return {
    links,
    loading,
    addLink,
    updateLinks,
    findLinkByCode,
    isCodeUnique,
    setLinks
  };
};
