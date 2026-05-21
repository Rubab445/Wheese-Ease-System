import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, Leaf, Cpu,
  BarChart3, Settings,
  Moon, LogOut, ChevronRight
} from 'lucide-react';
import '../Admin.module.css/AdminSidebar.css';
import logoImg from '../../assets/logo.png';
import { supabase } from '../../lib/supabase';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isExpanded: boolean;
  isMobile?: boolean;
}

export default function Sidebar({
  activeModule,
  onModuleChange,
  isExpanded,
}: SidebarProps) {

  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from('admins')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
      if (data?.full_name) setAdminName(data.full_name);
    });
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const initials = adminName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className={`admin-sidebar ${!isExpanded ? 'collapsed' : ''}`}>

      {/* ================= LOGO ================= */}
      <div className="admin-logo-section">
        <div className="admin-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px' }}>
          <img
            src={logoImg}
            alt="WheezeEase Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
          />
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
          <div className="admin-avatar" style={{ background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
            {initials}
          </div>
          {isExpanded && (
            <div className="admin-profile-info">
              <span className="admin-profile-name">{adminName}</span>
              <span className="admin-profile-role">Admin</span>
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
