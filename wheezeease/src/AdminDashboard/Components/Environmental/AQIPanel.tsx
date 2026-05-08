import React, { useEffect, useState } from 'react';

interface AQIPanelProps {
  currentAQI: number;
  gaugeColor: string;
}

const AQIPanel: React.FC<AQIPanelProps> = ({ currentAQI, gaugeColor }) => {
  const [gaugeValue, setGaugeValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setGaugeValue(currentAQI), 100);
    return () => clearTimeout(timer);
  }, [currentAQI]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const maxAQI = 300;
  const strokeDashoffset = circumference - (gaugeValue / maxAQI) * circumference;

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Air Quality Index Details</div>
          <div className="panel-subtitle">Data Source: OpenWeatherMap Air Pollution API</div>
        </div>
      </div>
      <div className="aqi-panel-grid">
        <div className="aqi-gauge-container">
          <svg className="gauge-svg" viewBox="0 0 160 160">
            <circle className="gauge-bg" cx="80" cy="80" r={radius} />
            <circle 
              className="gauge-fill" 
              cx="80" 
              cy="80" 
              r={radius} 
              stroke={gaugeColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
            <text className="gauge-text" x="80" y="80">{currentAQI}</text>
            <text className="gauge-label" x="80" y="80">AQI</text>
          </svg>
          <div className="aqi-level-text" style={{ color: gaugeColor }}>Moderate</div>
          <div className="aqi-desc">
            Acceptable for most patients. Unusually sensitive individuals should consider reducing prolonged outdoor activity.
          </div>
        </div>
        
        <div className="pollutants-grid">
          {[
            { name: 'PM2.5', value: 45.2, unit: 'μg/m³', limit: 50, color: '#F59E0B' },
            { name: 'PM10', value: 85.0, unit: 'μg/m³', limit: 100, color: '#10B981' },
            { name: 'NO₂', value: 34.5, unit: 'μg/m³', limit: 100, color: '#10B981' },
            { name: 'O₃', value: 68.0, unit: 'μg/m³', limit: 100, color: '#10B981' },
            { name: 'CO', value: 410, unit: 'μg/m³', limit: 1000, color: '#10B981' },
            { name: 'SO₂', value: 12.0, unit: 'μg/m³', limit: 50, color: '#10B981' },
          ].map(p => (
            <div key={p.name} className="pollutant-card">
              <div className="pollutant-header">
                <span className="pollutant-name">{p.name}</span>
                <span className="pollutant-unit">{p.unit}</span>
              </div>
              <div className="pollutant-value">{p.value}</div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min((p.value / p.limit) * 100, 100)}%`, background: p.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AQIPanel;
