import { useRef } from 'react';
import Banner from './Banner';
import DownloadButton from './DownloadButton';
import '../styles/BannerPreview.css';

function BannerPreview({ config }) {
  const bannerRef = useRef(null);

  return (
    <div className="preview-container">
      <div className="preview-wrapper">
        <Banner ref={bannerRef} config={config} />
      </div>
      <DownloadButton bannerRef={bannerRef} />
    </div>
  );
}

export default BannerPreview;
