import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import '../Admin.module.css/Settings.css';
import SettingsSidebar, { type SettingsSection } from '../Components/Settings/SettingsSidebar';
import SettingsContent from '../Components/Settings/SettingsContent';

const DEFAULT_SETTINGS = {
  // General
  platformName: "WheezeEase",
  tagline: "Asthma Management & Prediction System",
  defaultCity: "Lahore",
  defaultLat: 31.5204,
  defaultLng: 74.3587,
  // API Config
  owmApiKey: "••••••••••••••••••••••••",
  apiPlan: "Free",
  apiLimit: 1000,
  // Notifications
  pushNotifications: true,
  emailNotifications: true,
  alertCooldown: 60,
  adminEnvAlerts: true,
  adminQuotaAlerts: true,
  // Thresholds
  aqiWarning: 100,
  aqiDanger: 150,
  tempWarning: 40,
  humWarning: 70,
  seasonalMode: false,
  // AI Module
  aiEnabled: true,
  aiFrequency: "6",
  aiConfidence: 0.75,
  aiInputAQI: true,
  aiInputHistory: true,
  // Security
  twoFactor: false,
  sessionTimeout: 30,
};

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [formData, setFormData] = useState<Record<string, any>>(DEFAULT_SETTINGS);
  const [showToast, setShowToast] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wheezeEase_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormData({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (e) {
        console.error("Failed to parse settings");
      }
    }
  }, []);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'number' || type === 'range') {
      val = Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSave = () => {
    localStorage.setItem('wheezeEase_settings', JSON.stringify(formData));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to their defaults?")) {
      setFormData(DEFAULT_SETTINGS);
      localStorage.setItem('wheezeEase_settings', JSON.stringify(DEFAULT_SETTINGS));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="st-layout">
      <SettingsSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <div className="st-content-wrapper">
        <SettingsContent 
          activeSection={activeSection}
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
          onReset={handleReset}
        />
      </div>

      {showToast && (
        <div className="st-toast">
          <CheckCircle2 size={18} /> Settings saved successfully
        </div>
      )}
    </div>
  );
};

export default Settings;