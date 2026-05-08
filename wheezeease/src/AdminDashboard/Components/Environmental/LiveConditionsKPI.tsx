import React from 'react';
import { Thermometer, Droplets, Wind, Eye, Gauge, Activity } from 'lucide-react';

interface LiveConditionsKPIProps {
  currentAQI: number;
  gaugeColor: string;
}

const LiveConditionsKPI: React.FC<LiveConditionsKPIProps> = ({ currentAQI, gaugeColor }) => {
  return (
    <>
      <div className="section-label">
        <span className="section-label-text">Live Conditions</span>
        <span className="section-label-line" />
        <span className="api-tag api-tag-blue" style={{ marginLeft: '12px' }}>Data Source: OpenWeatherMap API</span>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--card-accent': '#60A5FA' } as React.CSSProperties}>
          <div className="kpi-header">
            <Thermometer size={24} className="kpi-icon-wrapper" />
          </div>
          <div className="kpi-label">Temperature</div>
          <div className="kpi-value">34<span className="kpi-unit">°C</span></div>
          <div className="kpi-sublabel">Feels like 37°C</div>
          <div className="kpi-status status-warning">Hot</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': '#34D399' } as React.CSSProperties}>
          <div className="kpi-header">
            <Droplets size={24} className="kpi-icon-wrapper" />
          </div>
          <div className="kpi-label">Humidity</div>
          <div className="kpi-value">62<span className="kpi-unit">%</span></div>
          <div className="kpi-sublabel">Dew point 26°C</div>
          <div className="kpi-status status-warning">High Risk</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': gaugeColor } as React.CSSProperties}>
          <div className="kpi-header">
            <Activity size={24} className="kpi-icon-wrapper" />
          </div>
          <div className="kpi-label">Air Quality (AQI)</div>
          <div className="kpi-value">{currentAQI}<span className="kpi-unit"></span></div>
          <div className="kpi-sublabel">PM2.5 Dominant</div>
          <div className="kpi-status status-moderate">Moderate</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': '#A78BFA' } as React.CSSProperties}>
          <div className="kpi-header">
            <Wind size={24} className="kpi-icon-wrapper" />
          </div>
          <div className="kpi-label">Wind Speed</div>
          <div className="kpi-value">14<span className="kpi-unit">km/h</span></div>
          <div className="kpi-sublabel">Direction: SW</div>
          <div className="kpi-status status-info">Spreading Pollen</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': '#FB923C' } as React.CSSProperties}>
          <div className="kpi-header">
            <Eye size={24} className="kpi-icon-wrapper" />
          </div>
          <div className="kpi-label">Visibility</div>
          <div className="kpi-value">7.4<span className="kpi-unit">km</span></div>
          <div className="kpi-sublabel">Slight haze</div>
          <div className="kpi-status status-moderate">Reduced</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': '#F472B6' } as React.CSSProperties}>
          <div className="kpi-header">
            <Gauge size={24} className="kpi-icon-wrapper" />
          </div>
          <div className="kpi-label">Pressure</div>
          <div className="kpi-value">1008<span className="kpi-unit">hPa</span></div>
          <div className="kpi-sublabel">Lower than avg</div>
          <div className="kpi-status status-warning">Falling</div>
        </div>
      </div>
    </>
  );
};

export default LiveConditionsKPI;
