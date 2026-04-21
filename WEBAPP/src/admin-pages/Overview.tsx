// src/pages/Overview.tsx
import React from 'react';
import { INIT_ACTIVITY, INIT_DOCTORS } from '../data/mockData';

interface OverviewProps {
  onShowToast: (msg: string) => void;
  onNavChange: (nav: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ onShowToast, onNavChange }) => {
  return (
    <div>
      <div className="page-head">
        <div><h2>System Overview</h2><p>Real-time snapshot of the entire WheezeEase platform</p></div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:'6px',background:'var(--green-lt)',border:'1px solid rgba(22,163,74,.25)',borderRadius:'8px',padding:'6px 12px',fontSize:'12px',fontWeight:'600',color:'var(--green)'}}>
            <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--green)',animation:'blink 2s infinite'}}></div>All Systems Operational
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onShowToast('📥 Report exported')}>📥 Export</button>
        </div>
      </div>
      <div className="grid4" style={{marginBottom:'20px'}}>
        <div className="stat s-blue"><div className="stat-icon">👥</div><div className="stat-val blue">247</div><div className="stat-label">Total Users</div><div className="stat-trend up">↑ 12 this week</div></div>
        <div className="stat s-teal"><div className="stat-icon">🩺</div><div className="stat-val teal">38</div><div className="stat-label">Active Doctors</div><div className="stat-trend up">3 pending approval</div></div>
        <div className="stat s-red"><div className="stat-icon">🚨</div><div className="stat-val red">12</div><div className="stat-label">High Risk Patients</div><div className="stat-trend dn">↑ 4 from yesterday</div></div>
        <div className="stat s-amber"><div className="stat-icon">⚠️</div><div className="stat-val amber">5</div><div className="stat-label">Unresponded Alerts</div><div className="stat-trend dn">Oldest: 28 min ago</div></div>
      </div>
      <div className="grid2" style={{marginBottom:'20px'}}>
        <div className="stat s-green"><div className="stat-icon">🤖</div><div className="stat-val green">94.2%</div><div className="stat-label">AI Accuracy (7 days)</div><div className="stat-trend up">↑ 1.3% vs last week</div></div>
        <div className="stat s-purple"><div className="stat-icon">📋</div><div className="stat-val purple">1,847</div><div className="stat-label">Check-ins This Week</div><div className="stat-trend up">↑ 18% vs last week</div></div>
      </div>
      <div className="grid2" style={{marginBottom:'20px'}}>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Recent Activity</div><div className="card-sub">Latest system events</div></div><button className="btn btn-ghost btn-sm" onClick={() => onNavChange('alerts')}>View All</button></div>
          <div>
            {INIT_ACTIVITY.map((a, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'11px 16px',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'var(--bg)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:'0'}}>{a.icon}</div>
                <div style={{flex:1,fontSize:'12px'}}>{a.msg}</div>
                <div style={{fontSize:'11px',color:'var(--dim)',whiteSpace:'nowrap'}}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Pending Doctor Approvals</div><div className="card-sub">Registrations awaiting review</div></div><span className="badge badge-amber">3 pending</span></div>
          <div>
            {INIT_DOCTORS.filter(d => d.status === 'pending').map(d => (
              <div key={d.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderBottom:'1px solid var(--border)'}}>
                <div className="tbl-av" style={{background:d.color,width:'36px',height:'36px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',color:'#fff'}}>{d.init}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:'13px',fontWeight:'700'}}>{d.name}</div><div style={{fontSize:'11px',color:'var(--muted)',marginTop:'1px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.spec} · {d.hosp}</div></div>
                <div style={{display:'flex',gap:'5px'}}>
                  <button className="btn btn-ghost btn-xs" onClick={() => onShowToast(`Reviewing ${d.name}`)}>Review</button>
                  <button className="btn btn-green btn-xs" onClick={() => onShowToast(`✅ ${d.name} approved`)}>✓</button>
                  <button className="btn btn-red btn-xs" onClick={() => onShowToast(`❌ ${d.name} rejected`)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">System Health</div><button className="btn btn-ghost btn-sm" onClick={() => onShowToast('🔄 Health check triggered')}>Refresh</button></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)'}}>
          {[
            { name: 'API', status: '🟢', text: 'Operational', sub: '42ms avg' },
            { name: 'Database', status: '🟢', text: 'Operational', sub: '99.9% uptime' },
            { name: 'AI Engine', status: '🟢', text: 'Operational', sub: '1.2s avg' },
            { name: 'Notifications', status: '🟡', text: 'Degraded', sub: '~4s delay', color: 'var(--amber)' },
            { name: 'AQI Feed', status: '🟢', text: 'Operational', sub: 'Updated 2m ago' },
          ].map(item => (
            <div key={item.name} style={{padding:'16px',textAlign:'center',borderRight:'1px solid var(--border)'}}>
              <div style={{fontSize:'20px',marginBottom:'6px'}}>{item.status}</div>
              <div style={{fontSize:'13px',fontWeight:'700'}}>{item.name}</div>
              <div style={{fontSize:'11px',color:item.color || 'var(--green)',fontWeight:'600',marginTop:'2px'}}>{item.text}</div>
              <div style={{fontSize:'10px',color:'var(--dim)',marginTop:'2px'}}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;