import { useState } from 'react';

/**
 * Custom hook to extract logos from websites using the /api endpoint
 * 
 * @returns {Object} - { extractLogo, loading, error, logo, allLogos }
 */
export const useLogoExtractor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logo, setLogo] = useState(null);
  const [allLogos, setAllLogos] = useState([]);

  /**
   * Extract the best logo from a URL
   * @param {string} url - The website URL to extract logo from
   * @returns {Promise<Object>} - Logo data
   */
  const extractLogo = async (url) => {
    setLoading(true);
    setError(null);
    setLogo(null);
    
    try {
      const response = await fetch(`/api?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract logo');
      }
      
      setLogo(data.logo);
      return data.logo;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Extract all logo candidates from a URL
   * @param {string} url - The website URL to extract logos from
   * @returns {Promise<Array>} - Array of logo candidates
   */
  const extractAllLogos = async (url) => {
    setLoading(true);
    setError(null);
    setAllLogos([]);
    
    try {
      const response = await fetch(`/api?url=${encodeURIComponent(url)}&return=json`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract logos');
      }
      
      setAllLogos(data.logos);
      return data.logos;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get direct image URL for a website's logo
   * @param {string} url - The website URL
   * @returns {string} - Direct image URL
   */
  const getDirectLogoUrl = (url) => {
    return `/api?url=${encodeURIComponent(url)}&direct=true`;
  };

  return {
    extractLogo,
    extractAllLogos,
    getDirectLogoUrl,
    loading,
    error,
    logo,
    allLogos,
  };
};
