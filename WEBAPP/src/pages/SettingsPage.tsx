import React, { useState } from 'react';
import Toast from '../components/Shared/Toast';

export const SettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [toggles, setToggles] = useState({
    highRisk: true,
    moderateRisk: true,
    inhalerOveruse: true,
    aqiAlerts: true,
    dailySummary: false,
  });

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  const hideToast = () => {
    setToast({ show: false, message: '' });
  };

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    setSaved(true);
    showToast('Settings saved successfully');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="settings-wrap">
        <div className="settings-card">
          <h3>Doctor Profile</h3>
          <div className="field-grid">
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Full Name</label>
              <input className="field-input" defaultValue="Dr. A. Rahman" style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Specialty</label>
              <input className="field-input" defaultValue="Pulmonology" style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Email</label>
              <input className="field-input" defaultValue="rahman@wheezeease.health" style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>Hospital</label>
              <input className="field-input" defaultValue="Gujranwala General Hospital" style={{ marginBottom: 0 }} />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h3>Notification Preferences</h3>
          <div className="setting-row">
            <div>
              <div className="setting-label">High Risk Alerts</div>
              <div className="setting-sublbl">Notify when patient risk exceeds 60%</div>
            </div>
            <button className={`toggle ${toggles.highRisk ? 'on' : ''}`} onClick={() => toggleSetting('highRisk')}></button>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Moderate Risk Alerts</div>
              <div className="setting-sublbl">Notify when patient risk is 31–60%</div>
            </div>
            <button className={`toggle ${toggles.moderateRisk ? 'on' : ''}`} onClick={() => toggleSetting('moderateRisk')}></button>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Inhaler Overuse</div>
              <div className="setting-sublbl">Alert when a patient uses inhaler 3+ times</div>
            </div>
            <button className={`toggle ${toggles.inhalerOveruse ? 'on' : ''}`} onClick={() => toggleSetting('inhalerOveruse')}></button>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">AQI Alerts</div>
              <div className="setting-sublbl">Alert when local AQI exceeds 150</div>
            </div>
            <button className={`toggle ${toggles.aqiAlerts ? 'on' : ''}`} onClick={() => toggleSetting('aqiAlerts')}></button>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Daily Summary Email</div>
              <div className="setting-sublbl">Receive patient summary every morning</div>
            </div>
            <button className={`toggle ${toggles.dailySummary ? 'on' : ''}`} onClick={() => toggleSetting('dailySummary')}></button>
          </div>
        </div>

        <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={saveSettings}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
      <Toast message={toast.message} show={toast.show} onHide={hideToast} />
    </>
  );
};