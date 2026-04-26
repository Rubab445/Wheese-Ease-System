// src/pages/Broadcast.tsx
import React, { useState } from 'react';
import { INIT_BROADCASTS,  } from '../data/mockData';
import type { BroadcastHistory } from '../types';

interface BroadcastProps {
  onShowToast: (msg: string) => void;
}

const Broadcast: React.FC<BroadcastProps> = ({ onShowToast }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all_doctors');
  const [history, setHistory] = useState<BroadcastHistory[]>(INIT_BROADCASTS);

  const useTemplate = (subj: string, msg: string) => {
    setSubject(subj);
    setMessage(msg);
    onShowToast('📋 Template loaded');
  };

  const sendBroadcast = () => {
    if (!subject) {
      onShowToast('⚠️ Please add a subject before sending');
      return;
    }
    const targetSelect = document.getElementById('broadcastTarget') as HTMLSelectElement;
    const targetLabel = targetSelect?.options[targetSelect.selectedIndex]?.textContent || target;
    setHistory([{ icon: '📢', title: subject, to: targetLabel || '', time: 'Just now' }, ...history]);
    setSubject('');
    setMessage('');
    onShowToast(`📢 Broadcast sent to ${targetLabel}`);
  };

  return (
    <div>
      <div className="page-head">
        <div><h2>Broadcast Message</h2><p>Send announcements to all doctors, all patients, or a specific group</p></div>
      </div>
      <div className="grid2">
        <div>
          <div className="card" style={{marginBottom:'16px'}}>
            <div className="card-head"><div className="card-title">Compose Broadcast</div></div>
            <div style={{padding:'18px 20px'}}>
              <div className="field-group">
                <label className="field-label">Send To</label>
                <select className="field-input field-select" id="broadcastTarget" value={target} onChange={e => setTarget(e.target.value)}>
                  <option value="all_doctors">All Doctors (38)</option>
                  <option value="all_patients">All Patients (209)</option>
                  <option value="high_risk">High Risk Patients Only (12)</option>
                  <option value="unassigned">Unassigned Patients (2)</option>
                  <option value="inactive_docs">Inactive Doctors (4)</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Message Type</label>
                <select className="field-input field-select">
                  <option>📢 General Announcement</option>
                  <option>⚠️ System Alert</option>
                  <option>🔔 Reminder</option>
                  <option>📋 Policy Update</option>
                  <option>🚨 Emergency Notice</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Subject</label>
                <input className="field-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Important system maintenance notice" />
              </div>
              <div className="field-group" style={{marginBottom:0}}>
                <label className="field-label">Message</label>
                <textarea className="field-input" rows={5} style={{resize:'none'}} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message here…"></textarea>
              </div>
            </div>
            <div style={{padding:'14px 20px',borderTop:'1px solid var(--border)',display:'flex',gap:'10px'}}>
              <button className="btn btn-ghost" onClick={() => onShowToast('👁 Preview')}>👁 Preview</button>
              <button className="btn btn-primary" onClick={sendBroadcast} style={{flex:1}}>📢 Send Broadcast</button>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:'16px'}}>
            <div className="card-head"><div className="card-title">Quick Templates</div></div>
            <div style={{padding:'12px 16px'}}>
              <div onClick={() => useTemplate('High AQI Warning','⚠️ Air quality in your area has reached dangerous levels (AQI > 150). Please advise your patients to stay indoors and carry rescue inhalers.')} style={{padding:'11px 14px',borderRadius:'10px',border:'1px solid var(--border)',cursor:'pointer',marginBottom:'8px'}}>
                <div style={{fontSize:'12px',fontWeight:'700'}}>⚠️ High AQI Warning</div>
                <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'3px'}}>Notify doctors about dangerous air quality</div>
              </div>
              <div onClick={() => useTemplate('Check-in Reminder','📋 Reminder: Please ensure your patients complete their daily health check-in. Patients who miss 2+ consecutive days should be contacted directly.')} style={{padding:'11px 14px',borderRadius:'10px',border:'1px solid var(--border)',cursor:'pointer',marginBottom:'8px'}}>
                <div style={{fontSize:'12px',fontWeight:'700'}}>📋 Check-in Reminder</div>
                <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'3px'}}>Remind doctors to follow up on patients</div>
              </div>
              <div onClick={() => useTemplate('System Maintenance','🔧 WheezeEase will undergo scheduled maintenance on Sunday 2:00–4:00 AM. The system may be briefly unavailable. Plan patient monitoring accordingly.')} style={{padding:'11px 14px',borderRadius:'10px',border:'1px solid var(--border)',cursor:'pointer',marginBottom:'8px'}}>
                <div style={{fontSize:'12px',fontWeight:'700'}}>🔧 System Maintenance</div>
                <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'3px'}}>Announce scheduled downtime</div>
              </div>
              <div onClick={() => useTemplate('Emergency Protocol','🚨 Emergency weather advisory issued for your region. All high-risk patients must be contacted and advised to avoid outdoor exposure. Activate emergency monitoring protocols.')} style={{padding:'11px 14px',borderRadius:'10px',border:'1px solid var(--border)',cursor:'pointer'}}>
                <div style={{fontSize:'12px',fontWeight:'700'}}>🚨 Emergency Protocol</div>
                <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'3px'}}>Activate emergency procedures</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Recent Broadcasts</div></div>
            <div>
              {history.map((b, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderBottom:'1px solid var(--border)'}}>
                  <div style={{fontSize:'18px'}}>{b.icon}</div>
                  <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'600'}}>{b.title}</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'1px'}}>→ {b.to} · {b.time}</div></div>
                  <button className="btn btn-ghost btn-xs" onClick={() => onShowToast(`📋 Resent: ${b.title}`)}>Resend</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;