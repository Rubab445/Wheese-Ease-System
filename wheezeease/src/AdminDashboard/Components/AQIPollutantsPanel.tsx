// AQIPollutantsPanel.tsx
// Data Source: OpenWeatherMap Air Pollution API
// Endpoint: GET http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}

import React from 'react';
import '../Admin.module.css/EnvironmentalMonitor.css'

interface PollutantData {
  name: string;
  fullName: string;
  value: number;
  unit: string;
  max: number;
  color: string;
}

interface AQIPollutantsPanelProps {
  aqi?: number;
  pollutants?: PollutantData[];
}

const defaultPollutants: PollutantData[] = [
  // Source: list[0].components.pm2_5
  { name: 'PM2.5', fullName: 'Fine Particles',     value: 23.4, unit: 'μg/m³', max: 75,  color: '#f59e0b' },
  // Source: list[0].components.pm10
  { name: 'PM10',  fullName: 'Coarse Particles',   value: 41.2, unit: 'μg/m³', max: 150, color: '#fb923c' },
  // Source: list[0].components.no2
  { name: 'NO₂',   fullName: 'Nitrogen Dioxide',   value: 12.8, unit: 'μg/m³', max: 200, color: '#8b5cf6' },
  // Source: list[0].components.o3
  { name: 'O₃',    fullName: 'Ozone',               value: 67.0, unit: 'μg/m³', max: 180, color: '#3b82f6' },
  // Source: list[0].components.co
  { name: 'CO',    fullName: 'Carbon Monoxide',     value: 0.41, unit: 'mg/m³', max: 10,  color: '#f43f5e' },
  // Source: list[0].components.so2
  { name: 'SO₂',   fullName: 'Sulphur Dioxide',    value: 5.2,  unit: 'μg/m³', max: 350, color: '#10b981' },
];

const AQI_LEVELS = [
  { label: 'Good',          color: '#10b981', range: '0–50',   description: 'Air quality is satisfactory.' },
  { label: 'Moderate',      color: '#f59e0b', range: '51–100', description: 'Acceptable for most people.' },
  { label: 'Unhealthy',     color: '#fb923c', range: '101–150',description: 'Sensitive groups at risk.' },
  { label: 'Hazardous',     color: '#f43f5e', range: '151+',   description: 'Everyone may be affected.' },
];

function getAQIConfig(aqi: number) {
  if (aqi <= 50)  return { label: 'Good',      color: '#10b981', dashColor: '#10b981', description: 'Air quality is satisfactory for asthma patients. Low risk today.' };
  if (aqi <= 100) return { label: 'Moderate',   color: '#f59e0b', dashColor: '#f59e0b', description: 'Acceptable quality. Unusually sensitive patients should reduce outdoor activity.' };
  if (aqi <= 150) return { label: 'Unhealthy',  color: '#fb923c', dashColor: '#fb923c', description: 'High risk for asthma & allergy patients. Limit prolonged outdoor exposure.' };
  return           { label: 'Hazardous',  color: '#f43f5e', dashColor: '#f43f5e', description: 'Emergency conditions. All respiratory patients must stay indoors.' };
}

const AQIPollutantsPanel: React.FC<AQIPollutantsPanelProps> = ({
  aqi = 87,
  pollutants = defaultPollutants,
}) => {
  const config = getAQIConfig(aqi);

  // SVG gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const fillRatio = Math.min(aqi / 300, 1);
  const dashOffset = circumference - fillRatio * circumference;

  return (
    <div className="panel">
      {/* Header */}
      <div className="panel-header">
        <div>
          <div className="panel-title">Air Quality Index</div>
          <div className="panel-subtitle">Real-time pollutant concentrations</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span className="api-tag">OpenWeatherMap</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
            /data/2.5/air_pollution
          </span>
        </div>
      </div>

      {/* AQI Gauge + Status */}
      <div className="aqi-gauge-wrap">
        <div className="aqi-gauge">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Track */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
            {/* Fill */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={config.dashColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${config.dashColor}60)` }}
            />
          </svg>
          <div className="aqi-gauge-center">
            <div className="aqi-number">{aqi}</div>
            <div className="aqi-label">AQI</div>
          </div>
        </div>

        <div className="aqi-info">
          <div className="aqi-status-text" style={{ color: config.color }}>
            {config.label}
          </div>
          <div className="aqi-description">{config.description}</div>

          {/* AQI legend */}
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {AQI_LEVELS.map((level) => (
              <div key={level.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: level.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
                  {level.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', opacity: 0.5 }}>
                  {level.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />

      {/* Pollutants label */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
        Pollutant Breakdown — <span style={{ color: 'var(--accent-teal)' }}>list[0].components</span>
      </div>

      {/* Pollutants Grid */}
      <div className="pollutants-grid">
        {pollutants.map((p) => (
          <div className="pollutant-item" key={p.name}>
            <div className="pollutant-name">{p.name}</div>
            <div className="pollutant-value">
              {p.value}
              <span className="pollutant-unit"> {p.unit}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>
              {p.fullName}
            </div>
            <div className="pollutant-bar">
              <div
                className="pollutant-bar-fill"
                style={{
                  width: `${Math.min((p.value / p.max) * 100, 100)}%`,
                  background: p.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AQIPollutantsPanel;