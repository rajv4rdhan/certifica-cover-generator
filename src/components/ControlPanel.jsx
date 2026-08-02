import TextControl from './controls/TextControl';
import SliderControl from './controls/SliderControl';
import DropdownControl from './controls/DropdownControl';
import LogoExtractor from './LogoExtractor';
import { COLOR_PALETTES } from '../config/constants';
import '../styles/ControlPanel.css';

function ControlPanel({ config, updateConfig }) {
  const handlePaletteChange = (paletteName) => {
    const palette = COLOR_PALETTES[paletteName];
    updateConfig('colorPalette', paletteName);
    updateConfig('bgColorTop', palette.top);
    updateConfig('bgColorBottom', palette.bottom);
  };

  return (
    <div className="control-panel">
      <div className="controls-grid">
        <div className="control-section">
          <TextControl
            label="Title"
            value={config.title}
            onChange={(value) => updateConfig('title', value)}
            multiline
          />
          <SliderControl
            label="Title Size"
            value={config.titleSize}
            onChange={(value) => updateConfig('titleSize', value)}
            min={20}
            max={60}
            unit="px"
          />
          <DropdownControl
            label="Background Color"
            value={config.colorPalette}
            options={Object.keys(COLOR_PALETTES)}
            onChange={handlePaletteChange}
          />
        </div>

        <div className="control-section">
          <LogoExtractor updateConfig={updateConfig} />
          <SliderControl
            label="Logo Scale"
            value={config.logoScale}
            onChange={(value) => updateConfig('logoScale', value)}
            min={0.3}
            max={1.5}
            step={0.05}
            unit="×"
          />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
