import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ALERTS_DATA = [
  { type: 'danger', title: 'AQI Approaching Unhealthy', desc: 'AQI has crossed 120. High risk for sensitive groups.', time: '10m ago', unread: true },
  { type: 'warning', title: 'Humidity Above 70%', desc: 'Mold growth risk increased. Monitor closely.', time: '45m ago', unread: true },
  { type: 'info', title: 'Rain Expected Tomorrow', desc: 'Pollen and dust levels will drop significantly.', time: '2h ago', unread: false },
  { type: 'danger', title: 'Pressure Dropping Fast', desc: 'Barometric pressure dropped 5hPa in 3 hours. Flare-ups expected.', time: '4h ago', unread: false },
];

const AlertsPanel: React.FC = () => {
  const [activeAlertTab, setActiveAlertTab] = useState<'all' | 'warnings' | 'info'>('all');

  const filteredAlerts = activeAlertTab === 'all'
    ? ALERTS_DATA
    : activeAlertTab === 'warnings'
      ? ALERTS_DATA.filter(a => a.type === 'danger' || a.type === 'warning')
      : ALERTS_DATA.filter(a => a.type === 'info');

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Environmental Alerts</div>
          <div className="panel-subtitle">Data Source: Internal Thresholds Engine</div>
        </div>
      </div>

      <div className="alerts-tabs">
        <button className={`alert-tab ${activeAlertTab === 'all' ? 'active' : ''}`} onClick={() => setActiveAlertTab('all')}>All</button>
        <button className={`alert-tab ${activeAlertTab === 'warnings' ? 'active' : ''}`} onClick={() => setActiveAlertTab('warnings')}>Warnings</button>
        <button className={`alert-tab ${activeAlertTab === 'info' ? 'active' : ''}`} onClick={() => setActiveAlertTab('info')}>Info</button>
      </div>

      <div className="alerts-list">
        {filteredAlerts.map((alert, i) => (
          <div key={i} className={`alert-card alert-${alert.type}`}>
            {alert.unread && <div className="unread-dot" />}
            <div className="alert-icon">
              {alert.type === 'danger' && <AlertTriangle size={20} />}
              {alert.type === 'warning' && <AlertCircle size={20} />}
              {alert.type === 'info' && <Info size={20} />}
            </div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-desc">{alert.desc}</div>
              <div className="alert-meta">
                <span>{alert.time}</span>
                <span>•</span>
                <span>Auto-notified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
