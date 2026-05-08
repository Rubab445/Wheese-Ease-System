import {
  LayoutDashboard, Users, Leaf, Cpu, 
  BarChart3, MessageSquare, Settings, 
  Moon, LogOut, ChevronRight
} from 'lucide-react';
import '../Admin.module.css/AdminSidebar.css';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isExpanded: boolean;
  isMobile: boolean;
}

export default function Sidebar({
  activeModule,
  onModuleChange,
  isExpanded,
  isMobile,
}: SidebarProps) {

  const mainNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'Users', icon: Users },
    { id: 'environmental-monitor', label: 'Environmental', icon: Leaf },
    { id: 'analytics', label: 'AI Monitoring', icon: Cpu },
    { id: 'report-details', label: 'System Reports', icon: BarChart3 },
  ];

  const systemNavigation = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className={`admin-sidebar ${!isExpanded ? 'collapsed' : ''}`}>
      
      {/* ================= LOGO ================= */}
      <div className="admin-logo-section">
        <div className="admin-logo-icon">
          <Leaf size={24} fill="currentColor" />
        </div>
        {isExpanded && <span className="admin-logo-text">WheezeEase</span>}
      </div>

      <div className="admin-sidebar-content">
        {/* ================= MAIN SECTION ================= */}
        <div className="admin-nav-section">
          {isExpanded && <h3 className="admin-section-title">MAIN</h3>}
          <nav className="admin-navigation">
            {mainNavigation.map((item) => {
              const isActive = activeModule === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onModuleChange(item.id)}
                  className={`admin-nav-item ${isActive ? 'admin-active' : ''}`}
                  title={!isExpanded ? item.label : ''}
                >
                  <Icon size={20} className="admin-nav-icon" />
                  {isExpanded && <span className="admin-nav-label">{item.label}</span>}
                  {isExpanded && isActive && <ChevronRight size={16} className="admin-active-indicator" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================= SYSTEM SECTION ================= */}
        <div className="admin-nav-section">
          {isExpanded && <h3 className="admin-section-title">SYSTEM</h3>}
          <nav className="admin-navigation">
            {systemNavigation.map((item) => {
              const isActive = activeModule === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onModuleChange(item.id)}
                  className={`admin-nav-item ${isActive ? 'admin-active' : ''}`}
                  title={!isExpanded ? item.label : ''}
                >
                  <Icon size={20} className="admin-nav-icon" />
                  {isExpanded && <span className="admin-nav-label">{item.label}</span>}
                </button>
              );
            })}
            
            {/* Dark Mode Toggle */}
            <div className="admin-nav-item dark-mode-toggle">
              <Moon size={20} className="admin-nav-icon" />
              {isExpanded && (
                <>
                  <span className="admin-nav-label">Dark Mode</span>
                  <label className="admin-switch">
                    <input type="checkbox" />
                    <span className="admin-slider round"></span>
                  </label>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* ================= PROFILE & LOGOUT ================= */}
      <div className="admin-sidebar-footer">
        <div className="admin-profile-section">
          <div className="admin-avatar">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=E8F5E9&color=2E7D32" alt="Avatar" />
          </div>
          {isExpanded && (
            <div className="admin-profile-info">
              <span className="admin-profile-name">Harper Nelson</span>
              <span className="admin-profile-role">Admin Manager</span>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="admin-logout-btn" title={!isExpanded ? 'Logout' : ''}>
          <LogOut size={18} />
          {isExpanded && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}