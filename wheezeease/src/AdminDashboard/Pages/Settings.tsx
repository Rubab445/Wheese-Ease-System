import React, { useState, useRef, type ChangeEvent } from 'react';
import '../Admin.module.css/Settings.css'

interface SettingsFormData {
  name: string;
  email: string;
  specialization: string;
  regNo: string;
  emailDigest: boolean;
  emergencyAlerts: boolean;
  patientUpdates: boolean;
  systemNews: boolean;
  twoFactor: boolean;
  sessionTimeout: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Original Data (Backup for Discard)
  const initialData: SettingsFormData = {
    name: "Dr. Ahmad",
    email: "m.usman@uog.edu.pk",
    specialization: "Pulmonologist",
    regNo: "PMDC-44821",
    emailDigest: true,
    emergencyAlerts: true,
    patientUpdates: false,
    systemNews: true,
    twoFactor: false,
    sessionTimeout: "30",
  };

  // Current State
  const [formData, setFormData] = useState<SettingsFormData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // FUNCTIONAL BUTTONS
  const handleDiscard = () => {
    if (window.confirm("Are you sure? All unsaved changes will be lost.")) {
      setFormData(initialData);
      setProfileImage(null);
      alert("Changes discarded!");
    }
  };

  const handleSave = () => {
    // Yahan aap apni Axios/Fetch call laga sakte hain
    console.log("Saving Data to Database...", formData);
    alert("Success! Settings updated properly.");
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-glass-card">
        {/* SIDEBAR */}
        <aside className="settings-nav-pane">
          <div className="nav-brand">
            <div className="brand-dot"></div>
            <span>WheezeEase</span>
          </div>
          <nav>
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
              <span className="nav-icon">👤</span> Profile
            </button>
            <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
              <span className="nav-icon">🔔</span> Notifications
            </button>
            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
              <span className="nav-icon">🛡️</span> Security
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <section className="settings-workspace">
          <div className="workspace-header">
            <div>
              <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p>Manage your account settings and preferences.</p>
            </div>
            <div className="header-btns">
              <button className="btn-cancel" onClick={handleDiscard}>Discard</button>
              <button className="btn-save" onClick={handleSave}>Save Changes</button>
            </div>
          </div>

          <div className="workspace-content">
            {activeTab === 'profile' && (
              <div className="fade-in">
                <div className="photo-section">
                  <div className="photo-container">
                    {profileImage ? <img src={profileImage} alt="Profile" className="avatar-img" /> : <div className="avatar-placeholder">{formData.name.charAt(0)}</div>}
                    <button className="edit-badge" onClick={() => fileInputRef.current?.click()}>✎</button>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} hidden accept="image/*" />
                  <div className="photo-info">
                    <h3>Your Photo</h3>
                    <p>This will be displayed on your public profile.</p>
                  </div>
                </div>
                <div className="settings-grid">
                  <div className="input-box"><label>Full Name</label><input name="name" type="text" value={formData.name} onChange={handleInputChange} /></div>
                  <div className="input-box"><label>Email Address</label><input name="email" type="email" value={formData.email} onChange={handleInputChange} /></div>
                  <div className="input-box"><label>Specialization</label><input name="specialization" type="text" value={formData.specialization} onChange={handleInputChange} /></div>
                  <div className="input-box"><label>Reg No</label><input name="regNo" type="text" value={formData.regNo} onChange={handleInputChange} /></div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="fade-in">
                {[
                  { id: 'emailDigest', title: 'Email Digest', desc: 'Weekly summary reports.' },
                  { id: 'emergencyAlerts', title: 'Critical Alerts', desc: 'Instant SMS for emergencies.' },
                  { id: 'patientUpdates', title: 'New Patients', desc: 'Alert when a new patient joins.' },
                  { id: 'systemNews', title: 'System News', desc: 'New features and updates.' }
                ].map((item) => (
                  <div className="toggle-card" key={item.id}>
                    <div className="toggle-info"><h4>{item.title}</h4><p>{item.desc}</p></div>
                    <label className="ios-switch">
                      <input type="checkbox" name={item.id} checked={(formData as any)[item.id]} onChange={handleInputChange} />
                      <span className="ios-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="fade-in">
                <div className="toggle-card danger-zone">
                  <div className="toggle-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Secure your account with an extra layer.</p>
                  </div>
                  <label className="ios-switch">
                    <input type="checkbox" name="twoFactor" checked={formData.twoFactor} onChange={handleInputChange} />
                    <span className="ios-slider"></span>
                  </label>
                </div>
                <div className="input-box" style={{marginTop: '20px'}}>
                  <label>Auto-logout (Minutes)</label>
                  <select name="sessionTimeout" className="custom-select" value={formData.sessionTimeout} onChange={handleInputChange}>
                    <option value="15">15 Min</option>
                    <option value="30">30 Min</option>
                    <option value="60">60 Min</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;