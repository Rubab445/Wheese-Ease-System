import React, { useState, useRef, type ChangeEvent } from 'react';
import '../Admin.module.css/Settings.css';

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

  const [formData, setFormData] = useState<SettingsFormData>(initialData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value;

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

  const handleDiscard = () => {
    if (window.confirm("Discard changes?")) {
      setFormData(initialData);
      setProfileImage(null);
    }
  };

  const handleSave = () => {
    console.log("Saving:", formData);
    alert("Settings saved!");
  };

  return (
    <div className="admin-settingsRoot">
      <div className="admin-settingsCard">

        {/* SIDEBAR */}
        <aside className="admin-settingsSidebar">
          <div className="admin-settingsBrand">
            <div className="admin-brandDot"></div>
            <span>WheezeEase</span>
          </div>

          <nav className="admin-settingsNav">
            <button
              className={`admin-settingsNavBtn ${activeTab === 'profile' ? 'admin-activeNavBtn' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>

            <button
              className={`admin-settingsNavBtn ${activeTab === 'notifications' ? 'admin-activeNavBtn' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications
            </button>

            <button
              className={`admin-settingsNavBtn ${activeTab === 'security' ? 'admin-activeNavBtn' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🛡️ Security
            </button>
          </nav>
        </aside>

        {/* MAIN */}
        <section className="admin-settingsMain">

          {/* HEADER */}
          <div className="admin-settingsHeader">
            <div>
              <h1>{activeTab.toUpperCase()}</h1>
            
            </div>

            <div className="admin-settingsActions">
              <button className="admin-btnSecondary" onClick={handleDiscard}>
                Discard
              </button>
              <button className="admin-btnPrimary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="admin-settingsContent">

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <>
                <div className="admin-profileSection">
                  <div className="admin-avatarWrap">
                    {profileImage ? (
                      <img src={profileImage} className="admin-avatarImg" />
                    ) : (
                      <div className="admin-avatarPlaceholder">
                        {formData.name.charAt(0)}
                      </div>
                    )}

                    <div
                      className="admin-editBtn-settings"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      ✎
                    </div>
                  </div>

                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                  />
                </div>

                <div className="admin-formGrid">
                  <div className="admin-field">
                    <label>Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} />
                  </div>

                  <div className="admin-field">
                    <label>Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} />
                  </div>

                  <div className="admin-field">
                    <label>Specialization</label>
                    <input name="specialization" value={formData.specialization} onChange={handleInputChange} />
                  </div>

                  <div className="admin-field">
                    <label>Reg No</label>
                    <input name="regNo" value={formData.regNo} onChange={handleInputChange} />
                  </div>
                </div>
              </>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <>
                {[
                  { id: 'emailDigest', title: 'Email Digest' },
                  { id: 'emergencyAlerts', title: 'Emergency Alerts' },
                  { id: 'patientUpdates', title: 'Patient Updates' },
                  { id: 'systemNews', title: 'System News' },
                ].map(item => (
                  <div className="admin-toggleCard" key={item.id}>
                    <span>{item.title}</span>
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        name={item.id}
                        checked={(formData as any)[item.id]}
                        onChange={handleInputChange}
                      />
                      <span className="admin-slider"></span>
                    </label>
                  </div>
                ))}
              </>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <>
                <div className="admin-toggleCard">
                  <span>Two Factor Authentication</span>
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      name="twoFactor"
                      checked={formData.twoFactor}
                      onChange={handleInputChange}
                    />
                    <span className="admin-slider"></span>
                  </label>
                </div>

                <div className="admin-field">
                  <label>Auto Logout</label>
                  <select
                    name="sessionTimeout"
                    value={formData.sessionTimeout}
                    onChange={handleInputChange}
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                  </select>
                </div>
              </>
            )}

          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;