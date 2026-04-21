import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/dashboard.css';
import TopNav from './components/Layout/TopNav';
import { OverviewPage } from './pages/OverviewPage';
import { PatientsPage } from './pages/PatientsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { PATIENTS } from './data/patients';
import AdminDashboard from './AdminDashboard';
import LoginPage from './pages/LoginPage';

type Section = 'overview' | 'patients' | 'alerts' | 'analytics' | 'messages' | 'settings';

// ============================================================
// PROTECTED ROUTE COMPONENT
// ============================================================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// ============================================================
// MAIN DASHBOARD COMPONENT (for /dashboard)
// ============================================================
const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [messagePatientId, setMessagePatientId] = useState<string | null>(null);

  // Live risk update effect
  useEffect(() => {
    const interval = setInterval(() => {
      PATIENTS.forEach(p => {
        const delta = Math.floor(Math.random() * 5) - 2;
        p.risk = Math.max(5, Math.min(95, p.risk + delta));
        p.trend = delta > 1 ? 'up' : delta < -1 ? 'down' : 'flat';
      });
      // Force re-render
      setSelectedPatientId(prev => prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section as Section);
    // Close mobile menu
    const tabs = document.querySelector('.nav-tabs');
    if (tabs?.classList.contains('open')) {
      tabs.classList.remove('open');
    }
    // Reset message patient when leaving messages section
    if (section !== 'messages') {
      setMessagePatientId(null);
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

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
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
      <TopNav activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="layout">
        <div className={`main ${activeSection === 'patients' ? '' : 'active'}`} style={{ display: activeSection === 'patients' ? 'none' : 'flex' }}>
          {activeSection !== 'patients' && renderSection()}
        </div>
        {activeSection === 'patients' && renderSection()}
      </div>
    </>
  );
};
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route - Public */}
        <Route path="/login" element={
          <LoginPage/>
        } />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              localStorage.getItem('userRole') === 'admin' ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;