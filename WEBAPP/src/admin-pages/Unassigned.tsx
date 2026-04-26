// src/pages/Unassigned.tsx
import React from 'react';
import { riskBgCls, riskLabel } from '../utils/helper';
import type { Doctor, Patient } from '../types';

interface UnassignedProps {
  patients: Patient[];
  doctors: Doctor[];
  onAssignDoctor: (patientId: string) => void;
  onViewPatient: (id: string) => void;
  onShowToast: (msg: string) => void;
}

const Unassigned: React.FC<UnassignedProps> = ({ patients, doctors, onAssignDoctor, onViewPatient, onShowToast }) => {
  const unassigned = patients.filter(p => p.doctor === '—');
  
  const getRecommendedSpec = (cond: string): string => {
    const c = cond.toLowerCase();
    if (c.includes('asthma') || c.includes('copd')) return 'Pulmonologist';
    if (c.includes('allergy') || c.includes('allergic')) return 'Allergist';
    return 'General Physician';
  };

  return (
    <div>
      <div className="page-head">
        <div><h2>Unassigned Patients</h2><p>Admin override — for edge cases where automatic assignment failed</p></div>
        <button className="btn btn-amber btn-sm" onClick={() => onShowToast('📧 Reminder sent to all available doctors')}>📧 Notify Available Doctors</button>
      </div>
      <div style={{background:'var(--blue-lt)',border:'1px solid rgba(37,99,235,.2)',borderRadius:'var(--r)',padding:'16px 18px',marginBottom:'16px',display:'flex',gap:'14px',alignItems:'flex-start'}}>
        <div style={{fontSize:'22px',flexShrink:'0'}}>ℹ️</div>
        <div>
          <div style={{fontSize:'13px',fontWeight:'700',color:'var(--blue)',marginBottom:'6px'}}>Why does admin assign doctors here?</div>
          <div style={{fontSize:'12px',color:'var(--muted)',lineHeight:'1.8'}}>
            In normal flow, <strong style={{color:'var(--text)'}}>patients select their own doctor</strong> during app onboarding. These patients appear here only in <strong style={{color:'var(--text)'}}>exceptional cases</strong>:
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'10px'}}>
            <span style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'5px 10px',fontSize:'11px',fontWeight:'600',color:'var(--muted)'}}>⛔ Their doctor was suspended</span>
            <span style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'5px 10px',fontSize:'11px',fontWeight:'600',color:'var(--muted)'}}>⏭ Patient skipped selection</span>
            <span style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'5px 10px',fontSize:'11px',fontWeight:'600',color:'var(--muted)'}}>📋 Manually added by admin</span>
            <span style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'5px 10px',fontSize:'11px',fontWeight:'600',color:'var(--muted)'}}>🔄 Doctor left the platform</span>
          </div>
        </div>
      </div>
      <div className="card" style={{marginBottom:'16px',borderLeft:'4px solid var(--amber)'}}>
        <div style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{fontSize:'22px'}}>⚠️</div>
          <div style={{flex:1}}>
            <div style={{fontSize:'13px',fontWeight:'700'}}>{unassigned.length} patient{unassigned.length !== 1 ? 's are' : ' is'} not being monitored</div>
            <div style={{fontSize:'12px',color:'var(--muted)',marginTop:'2px'}}>The admin must assign a condition-matched doctor. Doctors will be notified automatically once assigned.</div>
          </div>
        </div>
      </div>
      <div className="card">
        {unassigned.length ? unassigned.map(p => {
          const spec = getRecommendedSpec(p.cond);
          const matchedDocs = doctors.filter(d => d.status === 'active' && d.spec.toLowerCase().includes(spec.toLowerCase()));
          return (
            <div key={p.id} style={{borderBottom:'1px solid var(--border)',padding:'18px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'14px'}}>
                <div className="tbl-av" style={{background:p.color,width:'44px',height:'44px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:'700',color:'#fff',flexShrink:'0'}}>{p.init}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'15px',fontWeight:'700'}}>{p.name}</div>
                  <div style={{fontSize:'12px',color:'var(--muted)',marginTop:'2px'}}>{p.id} · {p.cond} · {p.age}y · {p.city} · Last check-in: {p.lastCI}</div>
                </div>
                <span className={`badge ${riskBgCls(p.risk)}`}>{riskLabel(p.risk)} Risk · {p.risk}%</span>
                <div style={{display:'flex',gap:'6px'}}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onViewPatient(p.id)}>View Profile</button>
                  <button className="btn btn-primary btn-sm" onClick={() => onAssignDoctor(p.id)}>🔗 Assign Doctor</button>
                </div>
              </div>
              <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'10px',padding:'12px 14px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
                  <span style={{fontSize:'11px',fontWeight:'700',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em'}}>Recommended Specialty</span>
                  <span className="badge badge-blue">{spec}</span>
                  <span style={{fontSize:'11px',color:'var(--muted)',marginLeft:'4px'}}>{matchedDocs.length} available doctors</span>
                </div>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  {matchedDocs.slice(0, 3).map(d => (
                    <div key={d.id} style={{display:'flex',alignItems:'center',gap:'8px',background:'var(--white)',border:'1px solid var(--border)',borderRadius:'9px',padding:'8px 12px',cursor:'pointer',flex:1,minWidth:'160px'}} onClick={() => onAssignDoctor(p.id)}>
                      <div className="tbl-av" style={{background:d.color,width:'30px',height:'30px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'800',color:'#fff',flexShrink:'0'}}>{d.init}</div>
                      <div style={{minWidth:'0'}}>
                        <div style={{fontSize:'12px',fontWeight:'700',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.name}</div>
                        <div style={{fontSize:'10px',color:'var(--muted)'}}>{d.patients} patients · {d.response}</div>
                      </div>
                      <div style={{marginLeft:'auto',fontSize:'14px'}}>→</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }) : <div style={{padding:'40px',textAlign:'center',color:'var(--green)',fontSize:'14px',fontWeight:'600'}}>✅ All patients are assigned to a doctor</div>}
      </div>
    </div>
  );
};

export default Unassigned;