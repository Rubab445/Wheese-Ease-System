// src/pages/Reports.tsx
import React from 'react';

interface ReportsProps {
  onShowToast: (msg: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ onShowToast }) => {
  return (
    <div>
      <div className="page-head">
        <div><h2>Reports</h2><p>Generate and download system reports</p></div>
        <button className="btn btn-primary" onClick={() => onShowToast('📊 Generating full report…')}>Generate All Reports</button>
      </div>
      <div className="grid2" style={{marginBottom:'20px'}}>
        <div className="stat s-blue"><div className="stat-icon">📄</div><div className="stat-val blue">24</div><div className="stat-label">Reports Generated This Month</div></div>
        <div className="stat s-green"><div className="stat-icon">📅</div><div className="stat-val green">7</div><div className="stat-label">Scheduled Reports Active</div></div>
      </div>
      <div className="grid2">
        <div>
          <h3 style={{fontSize:'14px',fontWeight:'700',marginBottom:'12px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em'}}>Patient Reports</h3>
          <div className="report-card" onClick={() => onShowToast('📥 Generating: High Risk Patient Summary…')}><div className="report-icon" style={{background:'var(--red-lt)'}}>🚨</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'700'}}>High Risk Patient Summary</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'2px'}}>All patients with risk &gt;60% and their recent history</div></div><span className="badge badge-red">PDF</span></div>
          <div className="report-card" onClick={() => onShowToast('📥 Generating: Weekly Check-in Report…')}><div className="report-icon" style={{background:'var(--blue-lt)'}}>📋</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'700'}}>Weekly Check-in Report</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'2px'}}>Check-in completion rates, missed check-ins by patient</div></div><span className="badge badge-blue">CSV</span></div>
          <div className="report-card" onClick={() => onShowToast('📥 Generating: Medication Usage Report…')}><div className="report-icon" style={{background:'var(--purple-lt)'}}>💊</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'700'}}>Medication Usage Report</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'2px'}}>Inhaler usage patterns and overuse incidents</div></div><span className="badge badge-purple">PDF</span></div>
        </div>
        <div>
          <h3 style={{fontSize:'14px',fontWeight:'700',marginBottom:'12px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em'}}>Doctor & System Reports</h3>
          <div className="report-card" onClick={() => onShowToast('📥 Generating: Doctor Performance Report…')}><div className="report-icon" style={{background:'var(--teal-lt)'}}>🩺</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'700'}}>Doctor Performance Report</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'2px'}}>Response times, patient load, alert handling stats</div></div><span className="badge badge-teal">PDF</span></div>
          <div className="report-card" onClick={() => onShowToast('📥 Generating: AI Model Performance Report…')}><div className="report-icon" style={{background:'var(--green-lt)'}}>🤖</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'700'}}>AI Model Performance</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'2px'}}>Accuracy, anomalies, prediction distribution trends</div></div><span className="badge badge-green">PDF</span></div>
          <div className="report-card" onClick={() => onShowToast('📥 Generating: Environmental Triggers Report…')}><div className="report-icon" style={{background:'var(--amber-lt)'}}>🌫️</div><div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'700'}}>Environmental Triggers Report</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'2px'}}>AQI, pollen, humidity correlation with risk spikes</div></div><span className="badge badge-amber">CSV</span></div>
        </div>
      </div>
    </div>
  );
};

export default Reports;