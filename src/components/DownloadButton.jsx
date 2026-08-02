import { useState } from 'react';
import { downloadBanner } from '../utils/download';
import '../styles/DownloadButton.css';

function DownloadButton({ bannerRef }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!bannerRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadBanner(bannerRef.current);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download banner. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      className="download-button"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <span className="download-spinner"></span>
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download Cover</span>
        </>
      )}
    </button>
  );
}

export default DownloadButton;
