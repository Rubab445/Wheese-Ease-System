import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Droplets } from 'lucide-react';

const ForecastPanel: React.FC = () => {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">5-Day Forecast & Risk</div>
          <div className="panel-subtitle">Data Source: OpenWeatherMap 5-Day API (Used by AI)</div>
        </div>
      </div>
      
      <div className="forecast-strip">
        {[
          { day: 'Today', icon: <Sun size={24} color="#F59E0B" />, hi: 34, lo: 27, pop: 10, today: true },
          { day: 'Thu', icon: <Cloud size={24} color="#64748B" />, hi: 36, lo: 28, pop: 5, today: false },
          { day: 'Fri', icon: <CloudRain size={24} color="#3B82F6" />, hi: 31, lo: 25, pop: 60, today: false },
          { day: 'Sat', icon: <CloudLightning size={24} color="#6366F1" />, hi: 28, lo: 23, pop: 80, today: false },
          { day: 'Sun', icon: <Sun size={24} color="#F59E0B" />, hi: 30, lo: 24, pop: 30, today: false },
        ].map(d => (
          <div key={d.day} className={`env-forecast-card ${d.today ? 'today' : ''}`}>
            <div className="forecast-day">{d.day}</div>
            <div className="forecast-icon-wrapper" style={{ color: 'inherit' }}>{d.icon}</div>
            <div className="forecast-temps">
              <span className="temp-high">{d.hi}°</span>
              <span className="temp-low">{d.lo}°</span>
            </div>
            <div className="forecast-pop">
              <Droplets size={12}/> {d.pop}%
            </div>
          </div>
        ))}
      </div>

      <table className="risk-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Patient Risk Level</th>
            <th>AI Recommendation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Today</td>
            <td><span className="risk-badge" style={{ background: '#FEF2F2', color: '#DC2626' }}>High Risk</span></td>
            <td>Outdoor activity not advised.</td>
          </tr>
          <tr>
            <td>Thu</td>
            <td><span className="risk-badge" style={{ background: '#FEF2F2', color: '#DC2626' }}>High Risk</span></td>
            <td>Heat trigger expected. Pre-warn patients.</td>
          </tr>
          <tr>
            <td>Fri</td>
            <td><span className="risk-badge" style={{ background: '#F0FDF4', color: '#16A34A' }}>Low Risk</span></td>
            <td>Rain will wash out pollen. Safe day.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ForecastPanel;
