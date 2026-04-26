// src/pages/AIMonitor.tsx
import React from 'react';

interface AIMonitorProps {
  onViewPatient: (patientId: string) => void;
  onEscalate: (patientName: string, doctorName: string) => void;
}

const AIMonitor: React.FC<AIMonitorProps> = ({ onViewPatient, onEscalate }) => {
  return (
    <div>
      <div className="page-head">
        <div><h2>AI System Monitor</h2><p>Model performance, predictions and anomalies</p></div>
        <div style={{display:'flex',gap:'8px'}}>
          <button className="btn btn-ghost btn-sm" onClick={() => alert('📊 AI report exported')}>📥 Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => alert('🔄 Retraining scheduled for tonight 2:00 AM')}>🔄 Schedule Retrain</button>
        </div>
      </div>
      <div className="grid4" style={{marginBottom:'20px'}}>
        <div className="stat s-green"><div className="stat-icon">🎯</div><div className="stat-val green">94.2%</div><div className="stat-label">Model Accuracy</div><div className="stat-trend up">↑ vs last week</div></div>
        <div className="stat s-blue"><div className="stat-icon">⚡</div><div className="stat-val blue">1.2s</div><div className="stat-label">Avg Response Time</div></div>
        <div className="stat s-purple"><div className="stat-icon">🔢</div><div className="stat-val purple">3,241</div><div className="stat-label">Predictions Today</div><div className="stat-trend up">↑ 8%</div></div>
        <div className="stat s-amber"><div className="stat-icon">⚠️</div><div className="stat-val amber">3</div><div className="stat-label">Anomalies Flagged</div></div>
      </div>
      <div className="grid2" style={{marginBottom:'20px'}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Prediction Distribution</div><div className="card-sub">Last 7 days</div></div>
          <div style={{padding:'18px 20px'}}>
            <div className="prog-wrap"><div className="prog-label"><span>Low Risk</span><span style={{color:'var(--green)',fontWeight:'700'}}>68%</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'68%',background:'var(--green)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>Moderate Risk</span><span style={{color:'var(--amber)',fontWeight:'700'}}>22%</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'22%',background:'var(--amber)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>High Risk</span><span style={{color:'var(--red)',fontWeight:'700'}}>10%</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'10%',background:'var(--red)'}}></div></div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Model Health Metrics</div></div>
          <div style={{padding:'18px 20px'}}>
            <div className="prog-wrap"><div className="prog-label"><span>Precision</span><span style={{color:'var(--blue)',fontWeight:'700'}}>96.1%</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'96%',background:'var(--blue)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>Recall</span><span style={{color:'var(--purple)',fontWeight:'700'}}>92.4%</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'92%',background:'var(--purple)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>F1 Score</span><span style={{color:'var(--teal)',fontWeight:'700'}}>94.2%</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'94%',background:'var(--teal)'}}></div></div></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Flagged Anomalies</div><div className="card-sub">Predictions that deviated significantly from expected range</div></div>
        <table className="tbl">
          <thead><tr><th>Patient</th><th>Predicted</th><th>Expected Range</th><th>Deviation</th><th>Time</th><th>Actions</th></tr></thead>
          <tbody>
            <tr>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'#e84393'}}>SA</div><div><div style={{fontWeight:'600'}}>Sara Ahmed</div><div style={{fontSize:'11px',color:'var(--muted)'}}>P-041</div></div></div></td>
              <td><span className="badge badge-red">92%</span></td>
              <td style={{color:'var(--muted)',fontSize:'12px'}}>60–80%</td>
              <td><span className="badge badge-amber">+12%</span></td>
              <td style={{color:'var(--muted)',fontSize:'12px'}}>10 min ago</td>
              <td><div style={{display:'flex',gap:'6px'}}>
                  <button className="btn btn-amber btn-xs" onClick={() => onEscalate('Sara Ahmed', 'Dr. A. Rahman')}>Escalate</button>
                  <button className="btn btn-ghost btn-xs" onClick={() => onViewPatient('P-041')}>View</button>
                </div>
              </td>
            </tr>
            <tr>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'#3a8eff'}}>UI</div><div><div style={{fontWeight:'600'}}>Usman Iqbal</div><div style={{fontSize:'11px',color:'var(--muted)'}}>P-033</div></div></div></td>
              <td><span className="badge badge-red">78%</span></td>
              <td style={{color:'var(--muted)',fontSize:'12px'}}>35–55%</td>
              <td><span className="badge badge-red">+23%</span></td>
              <td style={{color:'var(--muted)',fontSize:'12px'}}>1h ago</td>
              <td><div style={{display:'flex',gap:'6px'}}>
                  <button className="btn btn-amber btn-xs" onClick={() => onEscalate('Usman Iqbal', 'Dr. Hina Bajwa')}>Escalate</button>
                  <button className="btn btn-ghost btn-xs" onClick={() => onViewPatient('P-033')}>View</button>
                </div>
              </td>
            </tr>
            <tr>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'#22c87a'}}>HM</div><div><div style={{fontWeight:'600'}}>Hina Malik</div><div style={{fontSize:'11px',color:'var(--muted)'}}>P-015</div></div></div></td>
              <td><span className="badge badge-amber">48%</span></td>
              <td style={{color:'var(--muted)',fontSize:'12px'}}>5–20%</td>
              <td><span className="badge badge-amber">+28%</span></td>
              <td style={{color:'var(--muted)',fontSize:'12px'}}>3h ago</td>
              <td><div style={{display:'flex',gap:'6px'}}>
                  <button className="btn btn-amber btn-xs" onClick={() => onEscalate('Hina Malik', 'Dr. Kamran Malik')}>Escalate</button>
                  <button className="btn btn-ghost btn-xs" onClick={() => onViewPatient('P-015')}>View</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AIMonitor;