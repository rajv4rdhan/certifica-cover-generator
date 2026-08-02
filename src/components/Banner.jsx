import { forwardRef, useEffect, useRef } from 'react';
import { BANNER_DIMENSIONS, COLORS } from '../config/constants';
import { fitLogo } from '../utils/logoFit';
import '../styles/Banner.css';

const Banner = forwardRef(({ config }, ref) => {
  const logoImgRef = useRef(null);
  const logoWrapRef = useRef(null);

  useEffect(() => {
    const handleFit = () => {
      if (logoWrapRef.current && logoImgRef.current) {
        fitLogo(logoWrapRef.current, logoImgRef.current, config.logoScale);
      }
    };

    const img = logoImgRef.current;
    if (img) {
      if (img.complete) {
        handleFit();
      } else {
        img.addEventListener('load', handleFit);
      }
    }

    window.addEventListener('resize', handleFit);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleFit);
    }

    return () => {
      if (img) {
        img.removeEventListener('load', handleFit);
      }
      window.removeEventListener('resize', handleFit);
    };
  }, [config.logoUrl, config.logoScale]);

  return (
    <div 
      className="banner" 
      ref={ref}
      style={{
        '--card-w': `${BANNER_DIMENSIONS.width}px`,
        '--card-h': `${BANNER_DIMENSIONS.height}px`,
        '--blue': config.bgColorTop,
        '--green': config.bgColorBottom,
        '--red': COLORS.red,
        '--gold': COLORS.gold,
      }}
    >
      <div className="band-top"></div>
      <div className="band-bottom"></div>
      <div className="card">
        <div className="space-above-logo"></div>
        <div className="logo-wrap" ref={logoWrapRef}>
          <img 
            ref={logoImgRef}
            src={config.logoUrl} 
            alt="Logo" 
          />
        </div>
        <div className="text-block">
          <div 
            className="title"
            style={{ fontSize: `${config.titleSize}px` }}
          >
            {config.title}
          </div>
          <div 
            className="subtitle"
            style={{ fontSize: `${config.subtitleSize}px` }}
          >
            {config.subtitle}
          </div>
          <div 
            className="cta-btn"
            style={{ fontSize: `${config.ctaSize}px` }}
          >
            {config.ctaText}
          </div>
          <div 
            className="website"
            style={{ fontSize: `${config.websiteSize}px` }}
          >
            {config.website}
          </div>
        </div>
      </div>
    </div>
  );
});

Banner.displayName = 'Banner';

export default Banner;
