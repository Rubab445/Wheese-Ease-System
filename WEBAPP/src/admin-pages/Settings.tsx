// src/pages/Settings.tsx
import React from 'react';

interface SettingsProps {
  onShowToast: (msg: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onShowToast }) => {
  return (
    <div>
      <div className="page-head">
        <div><h2>Admin Settings</h2><p>Account and notification preferences</p></div>
        <button className="btn btn-primary" onClick={() => onShowToast('✅ Settings saved')}>💾 Save</button>
      </div>
      <div style={{maxWidth:'600px'}}>
        <div className="card" style={{marginBottom:'16px'}}>
          <div className="card-head"><div className="card-title">Admin Profile</div></div>
          <div style={{padding:'20px'}}>
            <div className="grid2">
              <div className="field-group"><label className="field-label">Full Name</label><input className="field-input" defaultValue="Super Admin" /></div>
              <div className="field-group"><label className="field-label">Email</label><input className="field-input" defaultValue="admin@wheezeease.health" /></div>
              <div className="field-group"><label className="field-label">Role</label><input className="field-input" defaultValue="System Administrator" style={{opacity:'.6'}} readOnly /></div>
              <div className="field-group"><label className="field-label">Phone</label><input className="field-input" defaultValue="+92-300-0000000" /></div>
            </div>
          </div>
        </div>
        <div className="card" style={{marginBottom:'16px'}}>
          <div className="card-head"><div className="card-title">Change Password</div></div>
          <div style={{padding:'20px'}}>
            <div className="field-group"><label className="field-label">Current Password</label><input className="field-input" type="password" placeholder="••••••••" /></div>
            <div className="field-group"><label className="field-label">New Password</label><input className="field-input" type="password" placeholder="••••••••" /></div>
            <div className="field-group" style={{marginBottom:'0'}}><label className="field-label">Confirm New Password</label><input className="field-input" type="password" placeholder="••••••••" /></div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Admin Notifications</div></div>
          <div style={{padding:'8px 20px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>SOS Triggers</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Notify on every SOS event</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>Doctor Approval Requests</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Alert when new doctor registers</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>Unresponded Alerts &gt;30 min</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Escalation notifications</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>Daily System Report</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Email summary every morning at 7 AM</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;