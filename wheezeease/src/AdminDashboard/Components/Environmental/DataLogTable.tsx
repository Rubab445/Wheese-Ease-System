import React from 'react';
import { ArrowDown } from 'lucide-react';

const LOG_DATA = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  time: `Today, ${14 - i}:00`,
  city: 'Gujrat',
  temp: 34 - Math.floor(Math.random() * 3),
  humidity: 62 + Math.floor(Math.random() * 5),
  aqi: 87 + Math.floor(Math.random() * 10),
  pm25: 45 + Math.floor(Math.random() * 5),
  wind: 14,
  visibility: 7.4,
  trigger: i % 3 === 0 ? 'Humidity' : 'AQI'
}));

const getAQIColor = (val: number) => {
  if (val <= 50) return '#10B981';
  if (val <= 100) return '#F59E0B';
  if (val <= 150) return '#F97316';
  return '#EF4444';
};

const DataLogTable: React.FC = () => {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Environmental Data Log</div>
          <div className="panel-subtitle">Data Source: Internal MongoDB (Aggregated from APIs)</div>
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp <ArrowDown size={12} style={{display:'inline'}}/></th>
              <th>Location</th>
              <th>Temp</th>
              <th>Humidity</th>
              <th>AQI</th>
              <th>PM2.5</th>
              <th>Wind</th>
              <th>Dominant Trigger</th>
            </tr>
          </thead>
          <tbody>
            {LOG_DATA.map((row) => (
              <tr key={row.id}>
                <td>{row.time}</td>
                <td>{row.city}</td>
                <td>{row.temp}°C</td>
                <td>{row.humidity}%</td>
                <td>
                  <span className="aqi-inline-square" style={{background: getAQIColor(row.aqi)}} />
                  {row.aqi}
                </td>
                <td>{row.pm25} μg</td>
                <td>{row.wind} km/h</td>
                <td><strong>{row.trigger}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataLogTable;
