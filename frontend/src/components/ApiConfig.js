import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './ApiConfig.css';

export default function ApiConfig({ apiUrl, onUrlChange, onTest, status }) {
  const [inputUrl, setInputUrl] = useState(apiUrl);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await axios.get(`${inputUrl}/health`, { timeout: 5000 });
      if (response.status === 200) {
        onTest();
      }
    } catch (error) {
      // Status already handled
    }
    setTesting(false);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setInputUrl(newUrl);
    onUrlChange(newUrl);
  };

  const statusIcon = {
    connected: <Check size={20} style={{ color: '#10b981' }} />,
    disconnected: <X size={20} style={{ color: '#ef4444' }} />,
    unknown: <AlertCircle size={20} style={{ color: '#f59e0b' }} />
  };

  return (
    <div className="api-config">
      <div className="config-inner">
        <div className="api-input-group">
          <input
            type="text"
            value={inputUrl}
            onChange={handleUrlChange}
            placeholder="http://localhost:3000/api"
            className="api-input"
          />
          <button 
            onClick={handleTest}
            disabled={testing}
            className="test-btn"
          >
            {testing ? 'Testing...' : '🔗 Test Connection'}
          </button>
        </div>
        <div className="status-display">
          {statusIcon[status]}
          <span>
            {status === 'connected' && 'Connected to API ✓'}
            {status === 'disconnected' && 'Cannot reach API ✗'}
            {status === 'unknown' && 'Test connection to verify'}
          </span>
        </div>
      </div>
    </div>
  );
}
