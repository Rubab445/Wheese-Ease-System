import React, { useState, useRef } from 'react';
import SettingsTab from '../../DoctorDashboard/Components/settings/SettingsTab'
import '../../styles/DoctorSettings.css'

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profileSubTab, setProfileSubTab] = useState<'Personal' | 'Professional'>('Personal');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fully Detailed State for Medical Professional
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: 'Dr. Ahmad',
    email: 'm.usman@uog.edu.pk',
    phone: '+92 300 7654321',
    cnic: '34101-XXXXXXX-X',
    dob: '1988-05-15',
    gender: 'Male',
    city: 'Gujrat',
    country: 'Pakistan',
    address: 'Phase 1, Kensington Heights',
    postalCode: '50700',
    // Professional Details
    specialization: 'Pulmonologist',
    regNo: 'PMDC-44821-P',
    hospital: 'Aziz Bhatti Shaheed Hospital',
    experience: '12 Years',
    qualification: 'MBBS, FCPS (Pulmonology)',
    consultationFee: '2000',
    clinicTiming: '05:00 PM - 09:00 PM',
    availability: 'Mon - Fri',
    clinicDays: 'Monday - Friday',
    emergencyContact: '+92 300 1234567',
    // Notifications
    emailReports: true,
    patientAlerts: true,
    systemUpdates: false,
    marketing: false,
    smsAlerts: false,
    criticalAlerts: true,
    // Security
    twoFactor: true,
    sessionTimeout: '30',
    loginNotifications: true,
    deviceManagement: true,
    // Appearance
    theme: 'light',
    fontSize: 'Medium',
    compactMode: false,
    reducedMotion: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="wheeze-settings-app">
      <main className="settings-main">
        <div className="settings-container">
          <header className="main-header">
            <div className="header-text">
              <h1>System Settings</h1>
              <p>Configure your personal identity and clinical preferences.</p>
            </div>
            <div className="header-actions">
              <button className="btn-discard" onClick={() => window.location.reload()}>Reset</button>
              <button className="btn-save" onClick={() => alert('All Changes Saved!')}>Save Changes</button>
            </div>
          </header>

          <div className="settings-nav-horizontal">
            <button className={activeTab === 'Profile' ? 'active' : ''} onClick={() => setActiveTab('Profile')}>
              <i className="fas fa-user-md"></i> Profile
            </button>
            <button className={activeTab === 'Notifications' ? 'active' : ''} onClick={() => setActiveTab('Notifications')}>
              <i className="fas fa-bell"></i> Notifications
            </button>
            <button className={activeTab === 'Security' ? 'active' : ''} onClick={() => setActiveTab('Security')}>
              <i className="fas fa-shield-alt"></i> Security
            </button>
            <button className={activeTab === 'Appearance' ? 'active' : ''} onClick={() => setActiveTab('Appearance')}>
              <i className="fas fa-palette"></i> Appearance
            </button>
          </div>

          <section className="settings-card">
            {/* PROFILE TAB */}
            {activeTab === 'Profile' && (
              <div className="animate-fade">
                <div className="photo-section">
                  <div className="avatar-wrapper">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="avatar-circle" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="avatar-circle">UA</div>
                    )}
                    <button className="edit-photo-btn" onClick={() => setShowUploadModal(true)}>
                      <i className="fas fa-camera"></i>
                    </button>
                  </div>
                  <div className="photo-text">
                    <h3>Doctor Profile Photo</h3>
                    <p>Recommended size: 400x400px (Max 2MB)</p>
                  </div>
                </div>

                <div className="sub-tab-nav">
                  <button className={profileSubTab === 'Personal' ? 'active' : ''} onClick={() => setProfileSubTab('Personal')}>
                    Personal Details
                  </button>
                  <button className={profileSubTab === 'Professional' ? 'active' : ''} onClick={() => setProfileSubTab('Professional')}>
                    Professional Record
                  </button>
                </div>

                <form className="settings-form">
                  {profileSubTab === 'Personal' ? (
                    <div className="form-grid">
                      <div className="input-group"><label>Full Name</label><input name="fullName" value={formData.fullName} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Email Address</label><input name="email" value={formData.email} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Phone Number</label><input name="phone" value={formData.phone} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>CNIC Number</label><input name="cnic" value={formData.cnic} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange}><option>Male</option><option>Female</option><option>Other</option></select></div>
                      <div className="input-group"><label>City</label><input name="city" value={formData.city} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Country</label><input name="country" value={formData.country} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Postal Code</label><input name="postalCode" value={formData.postalCode} onChange={handleInputChange} /></div>
                      <div className="input-group full-width"><label>Full Residential Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} /></div>
                    </div>
                  ) : (
                    <div className="form-grid">
                      <div className="input-group"><label>Medical Specialization</label><input name="specialization" value={formData.specialization} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>PMDC Registration Number</label><input name="regNo" value={formData.regNo} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Current Hospital/Clinic</label><input name="hospital" value={formData.hospital} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Consultation Fee (PKR)</label><input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Clinic Timing</label><input name="clinicTiming" value={formData.clinicTiming} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Clinic Days</label><input name="clinicDays" value={formData.clinicDays} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Total Experience</label><input name="experience" value={formData.experience} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Emergency Contact</label><input name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} /></div>
                      <div className="input-group full-width"><label>Educational Qualifications</label><textarea name="qualification" value={formData.qualification} onChange={handleInputChange} rows={2} /></div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'Notifications' && (
              <div className="animate-fade">
                <h3 className="section-header"><i className="fas fa-bell"></i> Alert Preferences</h3>
                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>Patient Reports</strong><p>Receive summaries of patient lung sounds and activity</p></div>
                    <label className="switch"><input type="checkbox" name="patientAlerts" checked={formData.patientAlerts} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>Critical Email Alerts</strong><p>Immediate notifications for emergency readings</p></div>
                    <label className="switch"><input type="checkbox" name="emailReports" checked={formData.emailReports} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>SMS Alerts</strong><p>Get critical alerts via text message</p></div>
                    <label className="switch"><input type="checkbox" name="smsAlerts" checked={formData.smsAlerts} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>Critical Patient Alerts</strong><p>High-priority notifications for severe cases</p></div>
                    <label className="switch"><input type="checkbox" name="criticalAlerts" checked={formData.criticalAlerts} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>System Updates</strong><p>Get notified about new AI model improvements</p></div>
                    <label className="switch"><input type="checkbox" name="systemUpdates" checked={formData.systemUpdates} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'Security' && (
              <div className="animate-fade">
                <h3 className="section-header"><i className="fas fa-shield-alt"></i> Account Safety</h3>
                <div className="form-grid">
                  <div className="input-group"><label>Current Password</label><input type="password" placeholder="Enter current password" /></div>
                  <div className="input-group"><label>New Password</label><input type="password" placeholder="Enter new password" /></div>
                  <div className="input-group"><label>Confirm Password</label><input type="password" placeholder="Confirm new password" /></div>
                  <div className="input-group"><label>Session Timeout (Minutes)</label><select name="sessionTimeout" value={formData.sessionTimeout} onChange={handleInputChange}><option value="15">15 Minutes</option><option value="30">30 Minutes</option><option value="60">1 Hour</option><option value="120">2 Hours</option></select></div>
                </div>
                <div className="toggle-list" style={{ marginTop: '24px' }}>
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>Two-Factor Authentication (2FA)</strong><p>Verify login via mobile app or SMS</p></div>
                    <label className="switch"><input type="checkbox" name="twoFactor" checked={formData.twoFactor} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>Login Notifications</strong><p>Get email when new device logs in</p></div>
                    <label className="switch"><input type="checkbox" name="loginNotifications" checked={formData.loginNotifications} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info"><strong>Device Management</strong><p>Manage trusted devices</p></div>
                    <label className="switch"><input type="checkbox" name="deviceManagement" checked={formData.deviceManagement} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'Appearance' && (
              <div className="animate-fade">
                <h3 className="section-header"><i className="fas fa-palette"></i> Interface Customization</h3>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Interface Theme</label>
                    <div className="theme-selector">
                      <button className={formData.theme === 'light' ? 'active' : ''} onClick={() => setFormData({...formData, theme: 'light'})}>
                        <i className="fas fa-sun"></i> Light Mode
                      </button>
                      <button className={formData.theme === 'dark' ? 'active' : ''} onClick={() => setFormData({...formData, theme: 'dark'})}>
                        <i className="fas fa-moon"></i> Dark Mode
                      </button>
                      <button className={formData.theme === 'system' ? 'active' : ''} onClick={() => setFormData({...formData, theme: 'system'})}>
                        <i className="fas fa-desktop"></i> System
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Font Size</label>
                    <select name="fontSize" value={formData.fontSize} onChange={handleInputChange}>
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                      <option>Extra Large</option>
                    </select>
                  </div>
                  <div className="toggle-item" style={{ gridColumn: 'span 2', marginTop: '8px' }}>
                    <div className="toggle-info"><strong>Compact Mode</strong><p>Reduce spacing for more content density</p></div>
                    <label className="switch"><input type="checkbox" name="compactMode" checked={formData.compactMode} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                  <div className="toggle-item" style={{ gridColumn: 'span 2' }}>
                    <div className="toggle-info"><strong>Reduced Motion</strong><p>Disable animations for better performance</p></div>
                    <label className="switch"><input type="checkbox" name="reducedMotion" checked={formData.reducedMotion} onChange={handleInputChange} /><span className="slider"></span></label>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Image Upload Modal */}
      {showUploadModal && (
        <div className="image-upload-modal" onClick={() => setShowUploadModal(false)}>
          <div className="image-upload-content" onClick={(e) => e.stopPropagation()}>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#7C3AED', marginBottom: '16px' }}></i>
            <h3>Upload Profile Photo</h3>
            <p>Choose a photo to display on your profile</p>
            <div className="upload-area" onClick={triggerFileInput}>
              <i className="fas fa-image"></i>
              <p>Click to browse or drag and drop</p>
              <p style={{ fontSize: '11px', marginTop: '8px' }}>PNG, JPG up to 2MB</p>
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
            <div className="modal-buttons">
              <button onClick={triggerFileInput}>Select File</button>
              <button onClick={() => setShowUploadModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;