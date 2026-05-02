import { Home, Users, UserCog, FileText, Cloud, BarChart3, Settings, LogOut, Mail } from 'lucide-react';
import '../Admin.module.css/AdminSidebar.css';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'doctor-management', label: 'Doctors', icon: UserCog },
    { id: 'patient-directory', label: 'Patients', icon: FileText },
    { id: 'environmental-monitor', label: 'Environmental Monitor', icon: Cloud },
    { id: 'analytics', label: 'AI Monitoring', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: Mail }, 
  ];

  // Logout Handler: Yeh function local storage clear karke login page pe bhej dega
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    // window.location use karna zyada behtar hai taake App state refresh ho jaye
    window.location.href = '/login';
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-logo-section">
        <div className="admin-logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 8L12 4L20 8L12 12L4 8Z" fill="currentColor" opacity="0.3"/>
            <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="admin-logo-text">WheezeEase</span>
      </div>

      <nav className="admin-navigation">
        {navigationItems.map((item) => {
          const isActive = activeModule === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`admin-nav-item ${isActive ? 'admin-active' : ''}`}
            >
              <Icon size={20} className="admin-nav-icon" />
              <span className="admin-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-bottom-section">
        <div className="admin-divider"></div>
        <button
          onClick={() => onModuleChange('settings')}
          className={`admin-nav-item ${activeModule === 'settings' ? 'admin-active' : ''}`}
        >
          <Settings size={20} className="admin-nav-icon" />
          <span className="admin-nav-label">Settings</span>
        </button>
        
        <button className="admin-logout-button" onClick={handleLogout}>
          <LogOut size={18} className="admin-nav-icon" />
          <span className="admin-nav-label">Log out</span>
        </button>
      </div>
    </div>
  );
}