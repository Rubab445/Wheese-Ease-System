import React from 'react';
import { 
  Settings2, 
  CloudRain, 
  BellRing, 
  ThermometerSun, 
  BrainCircuit, 
  ShieldCheck 
} from 'lucide-react';

export type SettingsSection = 'general' | 'api' | 'notifications' | 'thresholds' | 'ai' | 'security';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'general', label: 'General Settings', icon: <Settings2 size={18} /> },
    { id: 'api', label: 'API Configuration', icon: <CloudRain size={18} /> },
    { id: 'notifications', label: 'Notification & Alerts', icon: <BellRing size={18} /> },
    { id: 'thresholds', label: 'Env. Thresholds', icon: <ThermometerSun size={18} /> },
    { id: 'ai', label: 'AI Module Settings', icon: <BrainCircuit size={18} /> },
    { id: 'security', label: 'Security & Access', icon: <ShieldCheck size={18} /> },
  ] as const;

  return (
    <aside className="st-sidebar">
      <div className="st-sidebar-header">
        <h2 className="st-sidebar-title">WheezeEase Settings</h2>
        
      </div>
      <nav className="st-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`st-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
