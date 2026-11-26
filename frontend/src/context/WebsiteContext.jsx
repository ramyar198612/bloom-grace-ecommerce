
import { createContext, useContext, useEffect, useState } from 'react';
import getWebsiteContent from '../services/websiteService';

const WebsiteContext = createContext(null);

export function WebsiteProvider({ children }) {
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsiteContent = async () => {
      try {
        const data = await getWebsiteContent();
        setWebsiteData(data);
      } catch (err) {
        console.error('Failed to load website content:', err);
        setError('Unable to load website content.');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteContent();
  }, []);

  return (
    <WebsiteContext.Provider value={{ websiteData, loading, error }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  return useContext(WebsiteContext);
}
