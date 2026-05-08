import { useState, useEffect } from 'react';
import Sidebar from './AdminDashboard/Components/Sidebar';
import Overview from './AdminDashboard/Pages/AdminDashboard';
import UserManagement from './AdminDashboard/Pages/UserManagement';
import Reports from './AdminDashboard/Pages/Reports';
import EnvironmentalMonitor from './AdminDashboard/Pages/EnvironmentalMonitor';
import AIMonitoring from './AdminDashboard/Pages/AIMonitoring';
import Settings from './AdminDashboard/Pages/Settings';
import AdminMessages from './AdminDashboard/Pages/AdminMessages';

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded for better visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReportStatusChange = (reportId: string, newStatus: string) => {
    console.log(`Report ${reportId} status changed to ${newStatus}`);
  };

  const handleCloseReportDetail = () => {
    setSelectedReport(null);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Overview />;
      case 'user-management':
        return <UserManagement />;
      case 'report-details':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'environmental-monitor':
        return <EnvironmentalMonitor />;
      case 'analytics':
        return <AIMonitoring />;
      case 'messages':
        return <AdminMessages />;
      default:
        return (
          <div style={{ padding: '40px', backgroundColor: '#F8FAFC' }}>
            <h1>Module: {activeModule}</h1>
          </div>
        );
    }
  };

  const sidebarWidth = isExpanded ? '260px' : '80px';

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', backgroundColor: '#F8FAFC' }}>

      {/* ================= HAMBURGER ================= */}
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        style={{
          position: 'fixed',
          top: '20px',
          left: isExpanded ? '240px' : '65px',
          zIndex: 1400,
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'white',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          color: '#64748B'
        }}
      >
        {isExpanded ? '❮' : '❯'}
      </button>

      {/* ================= LEFT SIDEBAR ================= */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: sidebarWidth,
          backgroundColor: 'white',
          zIndex: 1300,
          transition: 'all 0.3s ease',
          boxShadow: '4px 0 10px rgba(0,0,0,0.02)'
        }}
      >
        <Sidebar
          activeModule={activeModule}
          isExpanded={isExpanded}
          isMobile={isMobile}
          onModuleChange={(module) => {
            setActiveModule(module);
            if (isMobile) setIsExpanded(false);
          }}
        />
      </div>

      {/* ================= MAIN ================= */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          transition: 'all 0.3s ease',
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#F8FAFC'
        }}
      >
        {renderModule()}
      </main>
    </div>
  );
}

