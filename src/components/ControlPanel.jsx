import { useState } from 'react';
import TextControl from './controls/TextControl';
import SliderControl from './controls/SliderControl';
import LogoExtractor from './LogoExtractor';
import { COLOR_PALETTES } from '../config/constants';
import '../styles/ControlPanel.css';

function ControlPanel({ config, updateConfig }) {
  const [activeTab, setActiveTab] = useState('content');

  const handlePaletteChange = (paletteName) => {
    const palette = COLOR_PALETTES[paletteName];
    if (palette) {
      updateConfig('colorPalette', paletteName);
      updateConfig('bgColorTop', palette.top);
      updateConfig('bgColorBottom', palette.bottom);
    }
  };

  return (
    <div className="control-panel">
      <div className="control-tabs">
        <button 
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logo' ? 'active' : ''}`}
          onClick={() => setActiveTab('logo')}
        >
          Logo
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'content' && (
          <div className="control-section">
            <h4 className="section-title">Cover Typography</h4>
            
            <div className="control-group">
              <TextControl
                label="Title Text"
                value={config.title}
                onChange={(value) => updateConfig('title', value)}
                multiline
              />
              <SliderControl
                label="Title Font Size"
                value={config.titleSize}
                onChange={(value) => updateConfig('titleSize', value)}
                min={24}
                max={60}
                unit="px"
              />
            </div>

            <div className="divider" />

            <div className="control-group">
              <TextControl
                label="Subtitle"
                value={config.subtitle || ''}
                onChange={(value) => updateConfig('subtitle', value)}
              />
              <SliderControl
                label="Subtitle Font Size"
                value={config.subtitleSize || 20}
                onChange={(value) => updateConfig('subtitleSize', value)}
                min={12}
                max={36}
                unit="px"
              />
            </div>

            <div className="divider" />

            <div className="control-group">
              <TextControl
                label="CTA Button Text"
                value={config.ctaText || ''}
                onChange={(value) => updateConfig('ctaText', value)}
              />
              <SliderControl
                label="CTA Font Size"
                value={config.ctaSize || 36}
                onChange={(value) => updateConfig('ctaSize', value)}
                min={16}
                max={48}
                unit="px"
              />
            </div>

            <div className="divider" />

            <div className="control-group">
              <TextControl
                label="Website URL"
                value={config.website || ''}
                onChange={(value) => updateConfig('website', value)}
              />
              <SliderControl
                label="Website Font Size"
                value={config.websiteSize || 22}
                onChange={(value) => updateConfig('websiteSize', value)}
                min={12}
                max={32}
                unit="px"
              />
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="control-section">
            <h4 className="section-title">Color Themes</h4>
            
            <label className="control-label-header">Preset Palettes</label>
            <div className="palette-grid">
              {Object.keys(COLOR_PALETTES).map((name) => {
                const palette = COLOR_PALETTES[name];
                const isActive = config.colorPalette === name;
                return (
                  <button
                    key={name}
                    type="button"
                    className={`palette-card ${isActive ? 'active' : ''}`}
                    onClick={() => handlePaletteChange(name)}
                  >
                    <div className="palette-preview">
                      <div className="palette-color-block" style={{ backgroundColor: palette.top }} />
                      <div className="palette-color-block" style={{ backgroundColor: palette.bottom }} />
                    </div>
                    <span className="palette-name">{name}</span>
                  </button>
                );
              })}
            </div>

            <div className="divider" />

            <h4 className="section-title">Custom Gradients</h4>
            <div className="custom-color-grid">
              <div className="custom-color-field">
                <label className="color-label">Top Band</label>
                <div className="color-input-row">
                  <input
                    type="color"
                    className="color-picker-input"
                    value={config.bgColorTop || '#000000'}
                    onChange={(e) => {
                      updateConfig('bgColorTop', e.target.value);
                      updateConfig('colorPalette', 'CUSTOM');
                    }}
                  />
                  <span className="color-hex-value">{config.bgColorTop}</span>
                </div>
              </div>

              <div className="custom-color-field">
                <label className="color-label">Bottom Band</label>
                <div className="color-input-row">
                  <input
                    type="color"
                    className="color-picker-input"
                    value={config.bgColorBottom || '#000000'}
                    onChange={(e) => {
                      updateConfig('bgColorBottom', e.target.value);
                      updateConfig('colorPalette', 'CUSTOM');
                    }}
                  />
                  <span className="color-hex-value">{config.bgColorBottom}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="control-section">
            <h4 className="section-title">Logo & Scaling</h4>
            <LogoExtractor updateConfig={updateConfig} />
            
            <div className="divider" />
            
            <div className="control-group">
              <SliderControl
                label="Logo Image Scale"
                value={config.logoScale}
                onChange={(value) => updateConfig('logoScale', value)}
                min={0.3}
                max={1.5}
                step={0.05}
                unit="×"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlPanel;
