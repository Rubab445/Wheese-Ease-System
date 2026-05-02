// ZoneMonitorTable.tsx
import React from 'react';
import '../Admin.module.css/AIMonitoring.css'

interface ZoneData {
  id: string;
  sector: string;
  aqi: number;
  status: 'Clear' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  pm25: number;
  pollenCount: number;
  lastUpdate: string;
}

interface ZoneMonitorTableProps {
  zones: ZoneData[];
}

const ZoneMonitorTable: React.FC<ZoneMonitorTableProps> = ({ zones }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Clear': return 'status-clear';
      case 'Moderate': return 'status-moderate';
      case 'Unhealthy': return 'status-unhealthy';
      case 'Hazardous': return 'status-hazardous';
      default: return '';
    }
  };

  return (
    <div className="zone-table-container">
      <div className="section-header">
        <h3 className="section-title">🗺️ Zone-wise Environmental Monitoring</h3>
        <button className="export-btn" onClick={() => alert('Exporting zone data...')}>
          📥 Export Report
        </button>
      </div>
      <div className="table-responsive">
        <table className="zone-table">
          <thead>
            <tr>
              <th>Zone ID</th>
              <th>Sector</th>
              <th>AQI</th>
              <th>Status</th>
              <th>PM2.5</th>
              <th>Pollen</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td className="zone-id">{zone.id}</td>
                <td>{zone.sector}</td>
                <td className="zone-aqi">{zone.aqi}</td>
                <td><span className={`status-badge ${getStatusColor(zone.status)}`}>{zone.status}</span></td>
                <td>{zone.pm25} µg/m³</td>
                <td>{zone.pollenCount}</td>
                <td className="update-time">{zone.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZoneMonitorTable;