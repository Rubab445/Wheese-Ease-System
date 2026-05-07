import { useState, useEffect } from 'react';
import Sidebar from './AdminDashboard/Components/Sidebar';
import UtilitySidebar from './AdminDashboard/Components/UtilitySidebar';
import Overview from './AdminDashboard/Pages/AdminDashboard';
import UserManagement from './AdminDashboard/Pages/UserManagement';
import DoctorManagement from './AdminDashboard/Pages/DoctorManagement';
import ReportDetailPanel from './AdminDashboard/Pages/Reportdetailpanel';
import EnvironmentalMonitor from './AdminDashboard/Pages/EnvironmentalMonitor';
import AIMonitoring from './AdminDashboard/Pages/AIMonitoring';
import Settings from './AdminDashboard/Pages/Settings';
import AdminMessages from './AdminDashboard/Pages/AdminMessages';

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUtility, setShowUtility] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReportStatusChange = (reportId: string, newStatus: string) => {
    // TODO: Implement status change logic
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
      case 'doctor-management':
        return <DoctorManagement />;
      case 'report-details':
        return <ReportDetailPanel report={selectedReport} onStatusChange={handleReportStatusChange} onClose={handleCloseReportDetail} />;
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

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', backgroundColor: '#F8FAFC' }}>

      {/* ================= HAMBURGER ================= */}
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        style={{
          position: 'fixed',
          top: '16px',
          left: isExpanded ? '200px' : '14px',
          zIndex: 1400,
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'white',
          border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          cursor: 'pointer',
        }}
      >
        {isExpanded ? '✕' : '☰'}
      </button>

      {/* ================= LEFT SIDEBAR ================= */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: isExpanded ? '250px' : '70px',
          backgroundColor: 'white',
          zIndex: 1300,
          paddingTop: '60px',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: '0.3s'
        }}
      >
        <Sidebar
          activeModule={activeModule}
          isExpanded={isExpanded}
          isMobile={isMobile}
          onOpenUtility={() => setShowUtility(true)}
          onModuleChange={(module) => {
            setActiveModule(module);
            setIsExpanded(false);
          }}
        />
      </div>

      {/* ================= MAIN ================= */}
      <main
        style={{
          flex: 1,
          marginLeft: '70px',
          marginRight: !isMobile ? '280px' : '0px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {renderModule()}
      </main>

      {/* ================= RIGHT UTILITY (DESKTOP ONLY) ================= */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          height: '100%',
          background: '#fff',
          zIndex: 1200,
          overflowY: 'auto'
        }}>
          <UtilitySidebar />
        </div>
      )}

      {/* ================= MOBILE UTILITY DRAWER ================= */}
      {isMobile && showUtility && (
        <>
          <div
            onClick={() => setShowUtility(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.35)',
              zIndex: 1400
            }}
          />

          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '280px',
            height: '100%',
            background: '#fff',
            zIndex: 1500,
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setShowUtility(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                fontSize: '18px'
              }}
            >
              ✕
            </button>

            <UtilitySidebar />
          </div>
        </>
      )}
    </div>
  );
}