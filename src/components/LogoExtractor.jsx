import { useState } from 'react';
import '../styles/LogoExtractor.css';

// Worker API URL
const WORKER_API_URL = '/api';

/**
 * Simple logo extraction component
 */
function LogoExtractor({ updateConfig }) {
  const [inputUrl, setInputUrl] = useState('');
  const [fetchedLogoUrl, setFetchedLogoUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleFetchLogo = async () => {
    if (!inputUrl) return;

    setIsFetching(true);
    setFetchError('');
    setFetchedLogoUrl('');

    try {
      const response = await fetch(`${WORKER_API_URL}?url=${encodeURIComponent(inputUrl)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logo: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.logo && data.logo.url) {
        setFetchedLogoUrl(data.logo.url);
        // Update the Logo URL in the config
        if (updateConfig) {
          updateConfig('logoUrl', data.logo.url);
        }
      } else {
        setFetchError('No logo found');
      }
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch logo');
      console.error('Error fetching logo:', err);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="logo-extractor">
      <label className="logo-extractor-label">Extract Logo from Domain</label>
      
      <div className="input-group">
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://example.com"
          className="url-input"
        />
        <button 
          type="button"
          onClick={handleFetchLogo}
          disabled={isFetching || !inputUrl}
          className="extract-button"
        >
          {isFetching ? 'Fetching...' : 'Fetch'}
        </button>
      </div>

      {fetchError && (
        <div className="error-message">
          {fetchError}
        </div>
      )}

      {fetchedLogoUrl && (
        <div className="logo-preview">
          <img 
            src={fetchedLogoUrl}
            alt="Logo preview" 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

export default LogoExtractor;
