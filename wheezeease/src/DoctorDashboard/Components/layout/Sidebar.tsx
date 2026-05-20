import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, Activity,
  ClipboardList, Bell, MessageSquare,
  Settings, Moon, LogOut, ChevronRight
} from 'lucide-react';
import '../../../AdminDashboard/Admin.module.css/AdminSidebar.css';
import { supabase } from '../../../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  activePage,
  onNavigate,
}: SidebarProps) {
  const isExpanded = isOpen;

  const [doctorName, setDoctorName] = useState('Doctor');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Pulmonologist');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from('doctors').select('full_name, specialty').eq('id', user.id).maybeSingle();
      if (data) {
        setDoctorName(data.full_name);
        setDoctorSpecialty(data.specialty ?? 'Pulmonologist');
      }
    });
  }, []);

  const mainNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Directory', icon: Users },
    { id: 'analytics', label: 'Health Analytics', icon: Activity },
    { id: 'alerts', label: 'Alerts Hub', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
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
    <div className={`admin-sidebar ${!isExpanded ? 'collapsed' : ''}`} style={{ position: 'relative' }}>
      
      {/* Tiny expand/collapse toggle floating on the edge just like Flup image */}
      <button 
        onClick={onToggle}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '32px',
          width: '24px',
          height: '24px',
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#64748B',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          zIndex: 10
        }}
      >
        <ChevronRight size={14} />
      </button>

      {/* ================= LOGO ================= */}
      <div className="admin-logo-section">
        <div className="admin-logo-icon">
          <Activity size={24} fill="currentColor" />
        </div>
        {isExpanded && <span className="admin-logo-text">WheezeEase</span>}
      </div>

      <div className="admin-sidebar-content">
        {/* ================= MAIN SECTION ================= */}
        <div className="admin-nav-section">
          {isExpanded ? <h3 className="admin-section-title">MAIN</h3> : <h3 className="admin-section-title" style={{textAlign: 'center'}}>M</h3>}
          <nav className="admin-navigation">
            {mainNavigation.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
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
          {isExpanded ? <h3 className="admin-section-title">SYSTEM</h3> : <h3 className="admin-section-title" style={{textAlign: 'center'}}>S</h3>}
          <nav className="admin-navigation">
            {systemNavigation.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`admin-nav-item ${isActive ? 'admin-active' : ''}`}
                  title={!isExpanded ? item.label : ''}
                >
                  <Icon size={20} className="admin-nav-icon" />
                  {isExpanded && <span className="admin-nav-label">{item.label}</span>}
                </button>
              );
            })}
            
            {/* Dark Mode Toggle */}
            <div className="admin-nav-item dark-mode-toggle" title="Dark Mode">
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
          <div className="admin-avatar" style={{ background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
            {doctorName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          {isExpanded && (
            <div className="admin-profile-info">
              <span className="admin-profile-name">{doctorName}</span>
              <span className="admin-profile-role">{doctorSpecialty}</span>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="admin-logout-btn" title={!isExpanded ? 'Logout' : ''}>
          <LogOut size={18} style={!isExpanded ? { margin: '0 auto' } : {}} />
          {isExpanded && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}