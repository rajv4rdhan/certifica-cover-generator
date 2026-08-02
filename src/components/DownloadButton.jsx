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
      {isDownloading ? 'Downloading...' : 'Download as Image'}
    </button>
  );
}

export default DownloadButton;
