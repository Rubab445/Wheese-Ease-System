import React, { useState } from 'react';
import { Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import type { SettingsSection } from './SettingsSidebar';

interface SettingsContentProps {
  activeSection: SettingsSection;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onReset: () => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({
  activeSection,
  formData,
  onChange,
  onSave,
  onReset
}) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const SectionHeader = ({ title, desc }: { title: string, desc: string }) => (
    <div className="st-section-header">
      <div>
        <h1 className="st-section-title">{title}</h1>
        <p className="st-section-desc">{desc}</p>
      </div>
      <div className="st-actions">
        <button className="st-btn st-btn-secondary" onClick={onReset}>
          <RotateCcw size={16} /> Reset
        </button>
        <button className="st-btn st-btn-primary" onClick={onSave}>
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );

  const Toggle = ({ id, title, desc }: { id: string, title: string, desc: string }) => (
    <div className="st-toggle-row">
      <div className="st-toggle-info">
        <span className="st-toggle-title">{title}</span>
        <span className="st-toggle-desc">{desc}</span>
      </div>
      <label className="st-switch">
        <input 
          type="checkbox" 
          name={id} 
          checked={formData[id] || false} 
          onChange={onChange} 
        />
        <span className="st-slider"></span>
      </label>
    </div>
  );

  // --- 1. General Settings ---
  if (activeSection === 'general') {
    return (
      <div className="st-content">
        <SectionHeader 
          title="General Settings" 
          desc="Configure basic platform information and localization preferences." 
        />
        
        <div className="st-card">
          <h3 className="st-card-title">Platform Information</h3>
          <p className="st-card-desc">These details appear across the dashboard and reports.</p>
          <div className="st-form-row">
            <div className="st-form-group">
              <label className="st-label">Platform Name</label>
              <input type="text" className="st-input" name="platformName" value={formData.platformName} onChange={onChange} />
            </div>
            <div className="st-form-group">
              <label className="st-label">Tagline</label>
              <input type="text" className="st-input" name="tagline" value={formData.tagline} onChange={onChange} />
            </div>
          </div>
        </div>

        <div className="st-card">
          <h3 className="st-card-title">Location & Region</h3>
          <p className="st-card-desc">Default location for Environmental Monitoring if patient location is unavailable.</p>
          <div className="st-form-row">
            <div className="st-form-group">
              <label className="st-label">Default City</label>
              <input type="text" className="st-input" name="defaultCity" value={formData.defaultCity} onChange={onChange} />
            </div>
            <div className="st-form-group-row">
              <div className="st-form-group">
                <label className="st-label">Latitude</label>
                <input type="number" className="st-input" name="defaultLat" value={formData.defaultLat} onChange={onChange} />
              </div>
              <div className="st-form-group">
                <label className="st-label">Longitude</label>
                <input type="number" className="st-input" name="defaultLng" value={formData.defaultLng} onChange={onChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. API Configuration ---
  if (activeSection === 'api') {
    return (
      <div className="st-content">
        <SectionHeader 
          title="API Configuration" 
          desc="Manage connection to OpenWeatherMap and API quota usage." 
        />
        
        <div className="st-card">
          <h3 className="st-card-title">OpenWeatherMap Credentials</h3>
          <div className="st-form-row">
            <div className="st-form-group">
              <label className="st-label">API Key</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type={showApiKey ? "text" : "password"} 
                  className="st-input" 
                  name="owmApiKey" 
                  value={formData.owmApiKey} 
                  onChange={onChange} 
                />
                <button 
                  className="st-btn st-btn-secondary" 
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{ padding: '0 12px' }}
                >
                  {showApiKey ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div className="st-form-group-row">
              <div className="st-form-group">
                <label className="st-label">Plan Type</label>
                <select className="st-select" name="apiPlan" value={formData.apiPlan} onChange={onChange}>
                  <option value="Free">Free Tier</option>
                  <option value="Pro">Pro Tier</option>
                </select>
              </div>
              <div className="st-form-group">
                <label className="st-label">Daily Limit</label>
                <input type="number" className="st-input" name="apiLimit" value={formData.apiLimit} onChange={onChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="st-card">
          <h3 className="st-card-title">API Usage Monitor</h3>
          <p className="st-card-desc">Current usage statistics for today.</p>
          <div className="st-progress-wrapper">
            <div className="st-progress-meta">
              <span>Calls Used</span>
              <span>247 / {formData.apiLimit}</span>
            </div>
            <div className="st-progress-bar-bg">
              <div className="st-progress-bar-fill" style={{ width: '24.7%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. Notification & Alerts ---
  if (activeSection === 'notifications') {
    return (
      <div className="st-content">
        <SectionHeader 
          title="Notification & Alerts" 
          desc="Configure how and when the system sends alerts to patients and admins." 
        />
        
        <div className="st-card">
          <h3 className="st-card-title">Patient Notifications</h3>
          <p className="st-card-desc">Methods used to alert patients of high risk conditions.</p>
          <Toggle id="pushNotifications" title="Push Notifications" desc="Send mobile push alerts via the app." />
          <Toggle id="emailNotifications" title="Email Alerts" desc="Send daily risk summaries via email." />
          <div className="st-form-group" style={{ marginTop: '16px' }}>
            <label className="st-label">Notification Cooldown (Minutes)</label>
            <input type="number" className="st-input" name="alertCooldown" value={formData.alertCooldown} onChange={onChange} />
          </div>
        </div>

        <div className="st-card">
          <h3 className="st-card-title">Admin Preferences</h3>
          <Toggle id="adminEnvAlerts" title="Environmental Threshold Alerts" desc="Notify admin when dangerous levels are detected." />
          <Toggle id="adminQuotaAlerts" title="API Quota Warnings" desc="Notify when API usage exceeds 80%." />
        </div>
      </div>
    );
  }

  // --- 4. Environmental Thresholds ---
  if (activeSection === 'thresholds') {
    return (
      <div className="st-content">
        <SectionHeader 
          title="Environmental Thresholds" 
          desc="Define the values that trigger warnings for patient risk levels." 
        />
        
        <div className="st-card">
          <h3 className="st-card-title">Global Alert Thresholds</h3>
          <div className="st-form-group-row">
            <div className="st-form-group">
              <label className="st-label">AQI Warning Level</label>
              <input type="number" className="st-input" name="aqiWarning" value={formData.aqiWarning} onChange={onChange} />
            </div>
            <div className="st-form-group">
              <label className="st-label">AQI Danger Level</label>
              <input type="number" className="st-input" name="aqiDanger" value={formData.aqiDanger} onChange={onChange} />
            </div>
          </div>
          <div className="st-form-group-row">
            <div className="st-form-group">
              <label className="st-label">Temp Warning (°C)</label>
              <input type="number" className="st-input" name="tempWarning" value={formData.tempWarning} onChange={onChange} />
            </div>
            <div className="st-form-group">
              <label className="st-label">Humidity Warning (%)</label>
              <input type="number" className="st-input" name="humWarning" value={formData.humWarning} onChange={onChange} />
            </div>
          </div>
        </div>

        <div className="st-card">
          <h3 className="st-card-title">Seasonal Adjustments</h3>
          <Toggle id="seasonalMode" title="Enable Spring Mode" desc="Automatically lower pollen thresholds by 20% during spring months." />
        </div>
      </div>
    );
  }

  // --- 5. AI Module Settings ---
  if (activeSection === 'ai') {
    return (
      <div className="st-content">
        <SectionHeader 
          title="AI Module Settings" 
          desc="Configure the AI prediction engine's behavior and data inputs." 
        />
        
        <div className="st-card">
          <h3 className="st-card-title">Prediction Engine</h3>
          <Toggle id="aiEnabled" title="Enable AI Risk Predictions" desc="Master switch for the ML inference engine." />
          
          <div className="st-form-row" style={{ marginTop: '16px' }}>
            <div className="st-form-group">
              <label className="st-label">Update Frequency</label>
              <select className="st-select" name="aiFrequency" value={formData.aiFrequency} onChange={onChange}>
                <option value="1">Every Hour</option>
                <option value="6">Every 6 Hours</option>
                <option value="12">Every 12 Hours</option>
                <option value="24">Once Daily</option>
              </select>
            </div>
            <div className="st-form-group">
              <label className="st-label">Minimum Confidence Score ({formData.aiConfidence})</label>
              <input 
                type="range" 
                min="0.5" max="0.99" step="0.01" 
                name="aiConfidence" 
                value={formData.aiConfidence} 
                onChange={onChange} 
                style={{ width: '100%', accentColor: '#2563EB' }}
              />
            </div>
          </div>
        </div>

        <div className="st-card">
          <h3 className="st-card-title">Data Inputs Used</h3>
          <Toggle id="aiInputAQI" title="Current AQI & Pollen" desc="Use live environmental data." />
          <Toggle id="aiInputHistory" title="Symptom History" desc="Use patient's past 30 days of logs." />
        </div>
      </div>
    );
  }

  // --- 6. Security & Access ---
  if (activeSection === 'security') {
    return (
      <div className="st-content">
        <SectionHeader 
          title="Security & Access" 
          desc="Manage admin authentication, sessions, and system audit logs." 
        />
        
        <div className="st-card">
          <h3 className="st-card-title">Authentication</h3>
          <Toggle id="twoFactor" title="Require Two-Factor Authentication" desc="Enforce 2FA for all admin logins." />
          <div className="st-form-group" style={{ marginTop: '16px' }}>
            <label className="st-label">Session Timeout (Minutes)</label>
            <input type="number" className="st-input" name="sessionTimeout" value={formData.sessionTimeout} onChange={onChange} />
          </div>
        </div>

        <div className="st-card">
          <h3 className="st-card-title">Active Sessions</h3>
          <div className="st-table-wrapper">
            <table className="st-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>IP Address</th>
                  <th>Browser</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dr. Ahmad</td>
                  <td>192.168.1.104</td>
                  <td>Chrome / Windows</td>
                  <td><span style={{ color: '#10B981', fontWeight: 600 }}>Current</span></td>
                </tr>
                <tr>
                  <td>Dr. Zafar</td>
                  <td>110.34.22.1</td>
                  <td>Safari / iOS</td>
                  <td><button className="st-btn st-btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>Revoke</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SettingsContent;
