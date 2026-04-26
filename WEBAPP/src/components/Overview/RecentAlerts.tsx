import React from 'react';
import { Alert } from '../../data/patients';

interface RecentAlertsProps {
  alerts: Alert[];
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  return (
    <>
      {alerts.slice(0, 5).map(a => (
        <div key={a.id} className="alert-row">
          <div className={`alert-indicator ${a.type}`}></div>
          <div style={{ flex: 1 }}>
            <div className="alert-msg">{a.icon} {a.msg}</div>
            <div className="alert-who">{a.patient}</div>
          </div>
          <div className="alert-time">{a.time}</div>
          {!a.read && <div className="unread-dot"></div>}
        </div>
      ))}
    </>
  );
};

export default RecentAlerts;