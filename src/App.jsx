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
      <div className="app-content">
        <BannerPreview config={config} />
        <ControlPanel config={config} updateConfig={updateConfig} />
      </div>
    </div>
  );
}

export default App;
