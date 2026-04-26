// src/pages/Alerts.tsx
import React, { useState } from 'react';
import type { Alert } from '../types';

interface AlertsProps {
  alerts: Alert[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: number) => void;
  onShowToast: (msg: string) => void;
}

const Alerts: React.FC<AlertsProps> = ({ alerts, onMarkRead, onMarkAllRead, onDismiss, onShowToast }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'sos' | 'system'>('all');
  
  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !a.read;
    return a.tag === filter || a.type === filter;
  });

  return (
    <div>
      <div className="page-head">
        <div><h2>System Alerts</h2><p>All platform-wide alerts and escalations</p></div>
        <div style={{display:'flex',gap:'8px'}}>
          <button className="btn btn-ghost btn-sm" onClick={onMarkAllRead}>✓ Mark All Read</button>
          <button className="btn btn-primary btn-sm" onClick={() => onShowToast('📥 Alert report exported')}>📥 Export</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
        {(['all', 'unread', 'high', 'sos', 'system'] as const).map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="card">
        {filtered.length ? filtered.map(a => (
          <div key={a.id} className={`alert-item ${!a.read ? 'unread' : ''}`}>
            <span style={{fontSize:'20px'}}>{a.icon}</span>
            <div className={`alert-dot ${a.type}`}></div>
            <div style={{flex:1}}>
              <div style={{fontSize:'13px',fontWeight:a.read ? 500 : 700}}>{a.msg}</div>
              <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'3px'}}>{a.patient} · {a.time}</div>
            </div>
            {!a.read && <span className="badge badge-blue" style={{fontSize:'9px',padding:'2px 7px'}}>NEW</span>}
            <div style={{display:'flex',gap:'6px',marginLeft:'8px'}}>
              {!a.read && <button className="btn btn-ghost btn-xs" onClick={() => onMarkRead(a.id)}>Read</button>}
              <button className="btn btn-red btn-xs" onClick={() => onDismiss(a.id)}>Dismiss</button>
            </div>
          </div>
        )) : <div style={{padding:'40px',textAlign:'center',color:'var(--dim)',fontSize:'13px'}}>No alerts in this category</div>}
      </div>
    </div>
  );
};

export default Alerts;