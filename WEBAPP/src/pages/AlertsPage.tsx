import React, { useState } from 'react';
import { ALERTS } from '../data/patients';
import Toast from '../components/Shared/Toast';

type AlertFilter = 'all' | 'unread' | 'high' | 'mod' | 'low';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState([...ALERTS]);
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  const hideToast = () => {
    setToast({ show: false, message: '' });
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') return !a.read;
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const markRead = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    showToast('Alert marked as read');
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    showToast('All alerts marked as read');
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Alert dismissed');
  };

  return (
    <>
      <div className="panel" style={{ flex: 1 }}>
        <div className="panel-head" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="panel-title">All Alerts</div>
          {unreadCount > 0 && (
            <span style={{ background: 'var(--red-bg)', color: 'var(--red)', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(232,68,90,0.2)' }}>
              {unreadCount} new
            </span>
          )}
          <button className="panel-link" style={{ marginLeft: 'auto' }} onClick={markAllRead}>Mark All Read</button>
        </div>
        <div className="alerts-filter">
          <button className={`af-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`af-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>Unread</button>
          <button className={`af-btn ${filter === 'high' ? 'active' : ''}`} onClick={() => setFilter('high')}>High</button>
          <button className={`af-btn ${filter === 'mod' ? 'active' : ''}`} onClick={() => setFilter('mod')}>Moderate</button>
          <button className={`af-btn ${filter === 'low' ? 'active' : ''}`} onClick={() => setFilter('low')}>Low</button>
        </div>
        <div id="alertsList">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(a => (
              <div key={a.id} className={`full-alert-row ${!a.read ? 'unread' : ''}`}>
                <span className="fa-icon">{a.icon}</span>
                <div className={`fa-dot ${a.type}`}></div>
                <div style={{ flex: 1 }}>
                  <div className="fa-msg" style={{ fontWeight: a.read ? 400 : 700 }}>{a.msg}</div>
                  <div className="fa-who" style={{ color: a.type === 'high' ? 'var(--red)' : a.type === 'mod' ? 'var(--amber)' : 'var(--green)' }}>
                    {a.patient} · {a.time}
                  </div>
                </div>
                {!a.read && <span style={{ fontSize: '10px', background: 'var(--blue-bg)', color: 'var(--blue)', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>NEW</span>}
                <div className="fa-actions">
                  {!a.read && <button className="fa-btn" onClick={() => markRead(a.id)}>Mark Read</button>}
                  <button className="fa-btn" onClick={() => dismissAlert(a.id)}>Dismiss</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--dim)', fontSize: '13px' }}>
              No alerts in this category
            </div>
          )}
        </div>
      </div>
      <Toast message={toast.message} show={toast.show} onHide={hideToast} />
    </>
  );
};