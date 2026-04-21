// src/pages/Analytics.tsx
import React from 'react';

interface AnalyticsProps {
  onViewDoctor: (doctorId: string) => void;
  onShowToast: (msg: string) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onViewDoctor, onShowToast }) => {
  return (
    <div>
      <div className="page-head">
        <div><h2>Platform Analytics</h2><p>System-wide trends and insights</p></div>
        <div style={{display:'flex',gap:'8px'}}>
          <select className="field-input field-select" style={{width:'130px',padding:'6px 12px',fontSize:'12px'}}>
            <option>This Week</option><option>This Month</option><option>Last 3 Months</option>
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => onShowToast('📥 Analytics exported')}>📥 Export</button>
        </div>
      </div>
      <div className="grid4" style={{marginBottom:'20px'}}>
        <div className="stat s-blue"><div className="stat-icon">📲</div><div className="stat-val blue">1,847</div><div className="stat-label">Check-ins This Week</div><div className="stat-trend up">↑ 18%</div></div>
        <div className="stat s-green"><div className="stat-icon">💊</div><div className="stat-val green">312</div><div className="stat-label">Medications Logged</div><div className="stat-trend up">↑ 6%</div></div>
        <div className="stat s-red"><div className="stat-icon">🆘</div><div className="stat-val red">7</div><div className="stat-label">SOS This Week</div><div className="stat-trend dn">↑ 2 vs last week</div></div>
        <div className="stat s-purple"><div className="stat-icon">💬</div><div className="stat-val purple">428</div><div className="stat-label">Messages Sent</div><div className="stat-trend up">↑ 24%</div></div>
      </div>
      <div className="grid2" style={{marginBottom:'20px'}}>
        <div className="card">
          <div className="card-head"><div className="card-title">Top Trigger Factors</div><div className="card-sub">This month</div></div>
          <div style={{padding:'18px 20px'}}>
            <div className="prog-wrap"><div className="prog-label"><span>High AQI (&gt;150)</span><span style={{color:'var(--red)',fontWeight:'700'}}>78 patients</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'78%',background:'var(--red)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>High Pollen</span><span style={{color:'var(--amber)',fontWeight:'700'}}>65 patients</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'65%',background:'var(--amber)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>High Humidity</span><span style={{color:'var(--blue)',fontWeight:'700'}}>42 patients</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'42%',background:'var(--blue)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>Inhaler Overuse</span><span style={{color:'var(--purple)',fontWeight:'700'}}>28 patients</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'28%',background:'var(--purple)'}}></div></div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Condition Breakdown</div></div>
          <div style={{padding:'18px 20px'}}>
            <div className="prog-wrap"><div className="prog-label"><span>Asthma</span><span style={{color:'var(--blue)',fontWeight:'700'}}>94 (45%)</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'45%',background:'var(--blue)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>Seasonal Allergy</span><span style={{color:'var(--green)',fontWeight:'700'}}>58 (28%)</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'28%',background:'var(--green)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>COPD</span><span style={{color:'var(--amber)',fontWeight:'700'}}>31 (15%)</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'15%',background:'var(--amber)'}}></div></div></div>
            <div className="prog-wrap"><div className="prog-label"><span>Dust Allergy</span><span style={{color:'var(--purple)',fontWeight:'700'}}>26 (12%)</span></div><div className="prog-bg"><div className="prog-fill" style={{width:'12%',background:'var(--purple)'}}></div></div></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Doctor Response Time Leaderboard</div></div>
        <table className="tbl">
          <thead>
            <tr><th>Rank</th><th>Doctor</th><th>Specialty</th><th>Avg Response</th><th>Alerts Handled</th><th>Rating</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style={{fontWeight:'700',color:'var(--amber)'}}>🥇 1</td>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'linear-gradient(135deg,#3a8eff,#7c5cfc)'}}>AR</div>Dr. A. Rahman</div></td>
              <td style={{color:'var(--muted)'}}>Pulmonology</td>
              <td><span className="badge badge-green">4 min</span></td>
              <td>142</td>
              <td>⭐ 4.9</td>
              <td><button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor('D-001')}>View</button></td>
            </tr>
            <tr>
              <td style={{fontWeight:'700',color:'var(--muted)'}}>🥈 2</td>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'linear-gradient(135deg,#e84393,#f5a623)'}}>SM</div>Dr. Sana Mirza</div></td>
              <td style={{color:'var(--muted)'}}>Allergist</td>
              <td><span className="badge badge-green">7 min</span></td>
              <td>98</td>
              <td>⭐ 4.8</td>
              <td><button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor('D-002')}>View</button></td>
            </tr>
            <tr>
              <td style={{fontWeight:'700',color:'var(--muted)'}}>🥉 3</td>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'linear-gradient(135deg,#20b2aa,#3a8eff)'}}>UF</div>Dr. Umar Farooq</div></td>
              <td style={{color:'var(--muted)'}}>Pulmonology</td>
              <td><span className="badge badge-amber">18 min</span></td>
              <td>76</td>
              <td>⭐ 4.7</td>
              <td><button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor('D-003')}>View</button></td>
            </tr>
            <tr>
              <td style={{color:'var(--muted)'}}>4</td>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'linear-gradient(135deg,#f5a623,#e84343)'}}>HB</div>Dr. Hina Bajwa</div></td>
              <td style={{color:'var(--muted)'}}>General</td>
              <td><span className="badge badge-amber">24 min</span></td>
              <td>210</td>
              <td>⭐ 4.6</td>
              <td><button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor('D-004')}>View</button></td>
            </tr>
            <tr>
              <td style={{color:'var(--red)'}}>5</td>
              <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="tbl-av" style={{background:'linear-gradient(135deg,#ff6b35,#f5a623)'}}>KM</div>Dr. Kamran Malik</div></td>
              <td style={{color:'var(--muted)'}}>General</td>
              <td><span className="badge badge-red">52 min</span></td>
              <td>89</td>
              <td>⭐ 4.5</td>
              <td><button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor('D-007')}>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;