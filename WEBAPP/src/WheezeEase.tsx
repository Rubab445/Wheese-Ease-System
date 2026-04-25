import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/dashboard.css';
import TopNav from './components/Layout/TopNav';
import Sidebar from './components/Layout/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { PatientsPage} from './pages/PatientsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { PATIENTS } from './data/patients';
import AdminDashboard from './AdminDashboard';
import LoginPage from './pages/LoginPage';

type Section = 'dashboard' | 'patients' | 'alerts' | 'analytics' | 'messages' | 'settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};



// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [messagePatientId, setMessagePatientId] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      PATIENTS.forEach(p => {
        const delta = Math.floor(Math.random() * 5) - 2;
        p.risk = Math.max(5, Math.min(95, p.risk + delta));
        p.trend = delta > 1 ? 'up' : delta < -1 ? 'down' : 'flat';
      });
      setSelectedPatientId(prev => prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section as Section);
    if (section !== 'messages') {
      setMessagePatientId(null);
    }
    if (isMobile) {
      setIsSidebarExpanded(false);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    if (activeSection !== 'patients') {
      setActiveSection('patients');
    }
  };

  const handleMessageFromDetail = (patientId: string) => {
    setMessagePatientId(patientId);
    setActiveSection('messages');
  };

  const handleHamburgerClick = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <OverviewPage
            onPatientSelect={handlePatientSelect}
            onViewAllPatients={() => setActiveSection('patients')}
            onViewAllAlerts={() => setActiveSection('alerts')}
          />
        );
      case 'patients':
        return (
          <PatientsPage
            selectedPatientId={selectedPatientId}
            onPatientSelect={setSelectedPatientId}
            onMessageFromDetail={handleMessageFromDetail}
          />
        );
      case 'alerts':
        return <AlertsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'messages':
        return <MessagesPage initialChatId={messagePatientId} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <>
      <TopNav 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        onHamburgerClick={handleHamburgerClick}
      />
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isExpanded={isSidebarExpanded}
      />
      <div className={`layout ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <div className={`main ${activeSection === 'patients' ? '' : 'active'}`} style={{ display: activeSection === 'patients' ? 'none' : 'flex' }}>
          {activeSection !== 'patients' && renderSection()}
        </div>
        {activeSection === 'patients' && renderSection()}
      </div>
      {isMobile && isSidebarExpanded && (
        <div className="mobile-overlay" onClick={() => setIsSidebarExpanded(false)}></div>
      )}
    </>
  );
};

// Main App
export const WheezeEase: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          localStorage.getItem('token') ? (
            localStorage.getItem('userRole') === 'admin' ? 
              <Navigate to="/admin-dashboard" replace /> : 
              <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default WheezeEase;