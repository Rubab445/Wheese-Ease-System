// LiveMetricTiles.tsx
import React from 'react';
import '../Admin.module.css/AIMonitoring.css'

interface LiveMetricTilesProps {
  data: {
    so2: number;
    co: number;
    pm10: number;
    aqi: number;
  };
}

const LiveMetricTiles: React.FC<LiveMetricTilesProps> = ({ data }) => {
  const metrics = [
    { label: 'SO₂', value: data.so2, unit: 'µg/m³', icon: '🏭', color: 'orange' },
    { label: 'CO', value: data.co, unit: 'ppm', icon: '🚗', color: 'red' },
    { label: 'PM10', value: data.pm10, unit: 'µg/m³', icon: '🌫️', color: 'purple' },
    { label: 'AQI Peak', value: data.aqi, unit: 'index', icon: '📊', color: 'green' },
  ];

  return (
    <div className="live-metrics-container">
      <div className="section-header">
        <h3 className="section-title">⚡ Live Pollutant Levels</h3>
        <span className="live-badge">LIVE</span>
      </div>
      <div className="metrics-grid">
        {metrics.map((metric, idx) => (
          <div key={idx} className={`metric-tile metric-${metric.color}`}>
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-info">
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value} <span className="metric-unit">{metric.unit}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMetricTiles;