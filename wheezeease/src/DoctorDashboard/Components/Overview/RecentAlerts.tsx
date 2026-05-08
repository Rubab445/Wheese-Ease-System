import React from 'react';
import type{ Alert } from '../../types/dashboard.types'

interface RecentAlertsProps {
  alerts: Alert[];
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  return (
    <div className="recent-alerts">
      {alerts.map((alert) => (
        <div key={alert.id} className="alert-row">
          <div className={`alert-indicator ${alert.type}`}></div>
          <div className="alert-content">
            <div className="alert-msg">
              {alert.icon} {alert.msg}
            </div>
            <div className="alert-who">{alert.patient}</div>
          </div>
          <div className="alert-time">{alert.time}</div>
          {!alert.read && <div className="unread-dot"></div>}
        </div>
      ))}
    </div>
  );
};

export default RecentAlerts;