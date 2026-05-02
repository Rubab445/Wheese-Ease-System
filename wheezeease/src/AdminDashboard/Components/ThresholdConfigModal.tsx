// ThresholdConfigModal.tsx
import React, { useState } from 'react';
import '../Admin.module.css/AIMonitoring.css'

interface ThresholdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThresholdConfigModal: React.FC<ThresholdConfigModalProps> = ({ isOpen, onClose }) => {
  const [thresholds, setThresholds] = useState({
    aqiWarning: 150,
    aqiCritical: 200,
    pm25Warning: 75,
    pm25Critical: 150,
    pollenWarning: 300,
    pollenCritical: 500,
  });

  const handleSave = () => {
    alert('Thresholds saved successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚙️ Configure Alert Thresholds</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="threshold-group">
            <h4>🌫️ AQI Thresholds</h4>
            <div className="threshold-row">
              <label>Warning Level:</label>
              <input type="number" value={thresholds.aqiWarning} onChange={(e) => setThresholds({...thresholds, aqiWarning: parseInt(e.target.value)})} />
              <span>AQI</span>
            </div>
            <div className="threshold-row">
              <label>Critical Level:</label>
              <input type="number" value={thresholds.aqiCritical} onChange={(e) => setThresholds({...thresholds, aqiCritical: parseInt(e.target.value)})} />
              <span>AQI</span>
            </div>
          </div>

          <div className="threshold-group">
            <h4>🌪️ PM2.5 Thresholds</h4>
            <div className="threshold-row">
              <label>Warning Level:</label>
              <input type="number" value={thresholds.pm25Warning} onChange={(e) => setThresholds({...thresholds, pm25Warning: parseInt(e.target.value)})} />
              <span>µg/m³</span>
            </div>
            <div className="threshold-row">
              <label>Critical Level:</label>
              <input type="number" value={thresholds.pm25Critical} onChange={(e) => setThresholds({...thresholds, pm25Critical: parseInt(e.target.value)})} />
              <span>µg/m³</span>
            </div>
          </div>

          <div className="threshold-group">
            <h4>🌸 Pollen Thresholds</h4>
            <div className="threshold-row">
              <label>Warning Level:</label>
              <input type="number" value={thresholds.pollenWarning} onChange={(e) => setThresholds({...thresholds, pollenWarning: parseInt(e.target.value)})} />
              <span>grains/m³</span>
            </div>
            <div className="threshold-row">
              <label>Critical Level:</label>
              <input type="number" value={thresholds.pollenCritical} onChange={(e) => setThresholds({...thresholds, pollenCritical: parseInt(e.target.value)})} />
              <span>grains/m³</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Thresholds</button>
        </div>
      </div>
    </div>
  );
};

export default ThresholdConfigModal;