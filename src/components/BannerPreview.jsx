import { useRef, useState, useEffect } from 'react';
import Banner from './Banner';
import DownloadButton from './DownloadButton';
import '../styles/BannerPreview.css';

function BannerPreview({ config }) {
  const bannerRef = useRef(null);
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    if (!viewportRef.current) return;

    const handleResize = () => {
      if (!viewportRef.current) return;
      const containerWidth = viewportRef.current.clientWidth;
      const containerHeight = viewportRef.current.clientHeight;
      
      const cardWidth = 1080;
      const cardHeight = 760;
      
      const scaleX = (containerWidth * 0.9) / cardWidth;
      const scaleY = (containerHeight * 0.9) / cardHeight;
      const newScale = Math.max(0.1, Math.min(scaleX, scaleY, 0.9));
      setScale(newScale);
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    observer.observe(viewportRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="preview-container">
      <div className="workspace-header">
        <div className="workspace-title">
          
          <span>Viewport Canvas</span>
        </div>
        <div className="workspace-stats">
          <span className="dimension-badge">1080 × 760 px</span>
          <span className="zoom-badge">{Math.round(scale * 100)}% scale</span>
        </div>
      </div>
      
      <div className="canvas-viewport" ref={viewportRef}>
        <div 
          className="preview-wrapper"
          style={{ 
            transform: `translate(-50%, -50%) scale(${scale})`
          }}
        >
          <Banner ref={bannerRef} config={config} />
        </div>
      </div>

      <div className="workspace-footer">
        <DownloadButton bannerRef={bannerRef} />
      </div>
    </div>
  );
}

export default BannerPreview;
