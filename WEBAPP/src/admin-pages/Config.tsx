// src/pages/Config.tsx
import React from 'react';

interface ConfigProps {
  onShowToast: (msg: string) => void;
}

const Config: React.FC<ConfigProps> = ({ onShowToast }) => {
  return (
    <div>
      <div className="page-head">
        <div><h2>System Configuration</h2><p>Global thresholds and platform feature toggles</p></div>
        <button className="btn btn-primary" onClick={() => onShowToast('✅ Configuration saved')}>💾 Save Changes</button>
      </div>
      <div className="grid2">
        <div>
          <div className="card" style={{marginBottom:'16px'}}>
            <div className="card-head"><div className="card-title">Risk Score Thresholds</div></div>
            <div style={{padding:'18px 20px'}}>
              <div className="field-group"><label className="field-label">High Risk Starts At (%)</label><input className="field-input" type="number" defaultValue="61" /></div>
              <div className="field-group"><label className="field-label">Moderate Risk Starts At (%)</label><input className="field-input" type="number" defaultValue="31" /></div>
              <div className="field-group" style={{marginBottom:'0'}}><label className="field-label">Low Risk Upper Limit (%)</label><input className="field-input" type="number" defaultValue="30" /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Environmental Alert Thresholds</div></div>
            <div style={{padding:'18px 20px'}}>
              <div className="field-group"><label className="field-label">AQI Warning Level</label><input className="field-input" type="number" defaultValue="100" /></div>
              <div className="field-group"><label className="field-label">AQI Danger Level</label><input className="field-input" type="number" defaultValue="150" /></div>
              <div className="field-group"><label className="field-label">Humidity Warning (%)</label><input className="field-input" type="number" defaultValue="75" /></div>
              <div className="field-group" style={{marginBottom:'0'}}><label className="field-label">Temperature Warning (°C)</label><input className="field-input" type="number" defaultValue="38" /></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:'16px'}}>
            <div className="card-head"><div className="card-title">Alert Escalation Rules</div></div>
            <div style={{padding:'18px 20px'}}>
              <div className="field-group"><label className="field-label">Escalate if Doctor Doesn't Respond (min)</label><input className="field-input" type="number" defaultValue="30" /></div>
              <div className="field-group"><label className="field-label">Max Inhaler Uses Before Alert</label><input className="field-input" type="number" defaultValue="3" /></div>
              <div className="field-group" style={{marginBottom:'0'}}><label className="field-label">SOS Auto-notify Emergency After (sec)</label><input className="field-input" type="number" defaultValue="120" /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">Feature Toggles</div></div>
            <div style={{padding:'8px 20px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>AI Recommendations</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Enable AI-generated patient advice</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>SOS Emergency Button</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Allow patients to trigger SOS</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>New Patient Registrations</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Allow new patients to sign up</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0'}}><div><div style={{fontSize:'13px',fontWeight:'600'}}>Doctor Self-Registration</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Require admin approval for new doctors</div></div><button className="toggle on" onClick={e => (e.currentTarget as HTMLElement).classList.toggle('on')}></button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;