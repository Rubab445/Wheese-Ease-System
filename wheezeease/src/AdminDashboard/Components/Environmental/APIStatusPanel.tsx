import React from 'react';
import { Database, Server, Map } from 'lucide-react';

const APIStatusPanel: React.FC = () => {
  return (
    <>
      <div className="section-label">
        <span className="section-label-text">System & Data Logs</span>
        <span className="section-label-line" />
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">API Connection Status</div>
            <div className="panel-subtitle">Data Source: OpenWeatherMap Quota Usage</div>
          </div>
        </div>

        <div className="api-grid">
          <div className="api-card">
            <div className="api-card-header">
              <Database size={16} color="#0F172A" />
              <span className="api-name">Current Weather</span>
            </div>
            <div className="api-endpoint">GET /data/2.5/weather</div>
            <div className="api-fields">Fields: <strong>temp, humidity, pressure, wind</strong></div>
            <div className="api-quota-header"><span>Quota (Daily)</span><span>45%</span></div>
            <div className="api-quota-bar-bg"><div className="api-quota-bar-fill" style={{ width: '45%' }} /></div>
          </div>
          <div className="api-card">
            <div className="api-card-header">
              <Server size={16} color="#0F172A" />
              <span className="api-name">Air Pollution</span>
            </div>
            <div className="api-endpoint">GET /data/2.5/air_pollution</div>
            <div className="api-fields">Fields: <strong>aqi, pm2_5, pm10, no2, o3</strong></div>
            <div className="api-quota-header"><span>Quota (Daily)</span><span>72%</span></div>
            <div className="api-quota-bar-bg"><div className="api-quota-bar-fill warning" style={{ width: '72%' }} /></div>
          </div>
          <div className="api-card">
            <div className="api-card-header">
              <Map size={16} color="#0F172A" />
              <span className="api-name">5-Day Forecast</span>
            </div>
            <div className="api-endpoint">GET /data/2.5/forecast</div>
            <div className="api-fields">Fields: <strong>temp_max, temp_min, pop</strong></div>
            <div className="api-quota-header"><span>Quota (Daily)</span><span>15%</span></div>
            <div className="api-quota-bar-bg"><div className="api-quota-bar-fill" style={{ width: '15%' }} /></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default APIStatusPanel;
