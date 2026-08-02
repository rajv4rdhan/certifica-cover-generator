import { useState } from 'react';
import BannerPreview from './components/BannerPreview';
import ControlPanel from './components/ControlPanel';
import { DEFAULT_CONFIG } from './config/constants';
import './styles/App.css';

function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">C</div>
          <span className="brand-title">Certifica Cover Studio</span>
          
        </div>
        <div className="header-meta">
          
        </div>
      </header>
      <div className="app-content">
        <BannerPreview config={config} />
        <ControlPanel config={config} updateConfig={updateConfig} />
      </div>
    </div>
  );
}

export default App;
