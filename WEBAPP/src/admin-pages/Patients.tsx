// src/pages/Patients.tsx
import React, { useState } from 'react';
import type{ Patient, Doctor } from '../types';

interface PatientsProps {
  patients: Patient[];
  doctors: Doctor[];
  onViewPatient: (id: string) => void;
  onAssignDoctor: (patientId: string) => void;
  onSuspendPatient: (patientId: string) => void;
  onRemovePatient: (patientId: string) => void;
  onShowToast: (msg: string) => void;
  onOpenAddModal: () => void;
}

const Patients: React.FC<PatientsProps> = ({ 
  patients, 
  doctors, 
  onViewPatient, 
  onAssignDoctor, 
  onSuspendPatient,
  onRemovePatient,
  onShowToast,
  onOpenAddModal
}) => {
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'mod' | 'low' | 'unassigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = patients.filter(p => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (riskFilter === 'all') return true;
    if (riskFilter === 'high') return p.risk >= 61;
    if (riskFilter === 'mod') return p.risk >= 31 && p.risk < 61;
    if (riskFilter === 'low') return p.risk < 31;
    if (riskFilter === 'unassigned') return p.doctor === '—';
    return true;
  });

  const totalPatients = patients.length;
  const highRisk = patients.filter(p => p.risk >= 61).length;
  const unassigned = patients.filter(p => p.doctor === '—').length;

  const riskBgCls = (r: number): string => r >= 61 ? 'badge-red' : (r >= 31 ? 'badge-amber' : 'badge-green');
  const riskLabel = (r: number): string => r >= 61 ? 'High' : (r >= 31 ? 'Moderate' : 'Low');

  return (
    <div>
      <div className="page-head">
        <div><h2>Patient Management</h2><p>All registered patients across the platform</p></div>
        <button className="btn btn-primary" onClick={onOpenAddModal}>＋ Add Patient</button>
      </div>
      <div className="grid4" style={{marginBottom:'20px'}}>
        <div className="stat s-blue"><div className="stat-icon">👥</div><div className="stat-val blue">{totalPatients}</div><div className="stat-label">Total Patients</div></div>
        <div className="stat s-red"><div className="stat-icon">🚨</div><div className="stat-val red">{highRisk}</div><div className="stat-label">High Risk Today</div></div>
        <div className="stat s-amber"><div className="stat-icon">🔗</div><div className="stat-val amber">{unassigned}</div><div className="stat-label">Unassigned</div></div>
        <div className="stat s-green"><div className="stat-icon">📋</div><div className="stat-val green">87%</div><div className="stat-label">Check-in Rate</div></div>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">All Patients</div>
          <div style={{display:'flex',gap:'8px'}}>
            <input 
              className="field-input" 
              style={{width:'200px',padding:'6px 12px'}} 
              placeholder="Search by name or ID…" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
            <select 
              className="field-input field-select" 
              style={{width:'150px',padding:'6px 12px'}} 
              value={riskFilter} 
              onChange={e => setRiskFilter(e.target.value as any)}
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="mod">Moderate</option>
              <option value="low">Low Risk</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Patient</th><th>Age / Gender</th><th>Condition</th><th>Risk</th><th>Assigned Doctor</th><th>Last Check-in</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div className="tbl-av" style={{background:p.color}}>{p.init}</div>
                  <div>
                    <div style={{fontWeight:'600'}}>{p.name}</div>
                    <div style={{fontSize:'11px',color:'var(--muted)'}}>{p.id}</div>
                  </div>
                </div></td>
                <td style={{color:'var(--muted)'}}>{p.age}y / {p.gender === 'F' ? 'Female' : 'Male'}</td>
                <td style={{color:'var(--muted)',fontSize:'12px'}}>{p.cond}</td>
                <td><span className={`badge ${riskBgCls(p.risk)}`}>{riskLabel(p.risk)} · {p.risk}%</span></td>
                <td style={{fontSize:'12px'}}>
                  {p.doctor === '—' ? 
                    <span style={{color:'var(--red)',fontWeight:'600'}}>⚠️ Unassigned</span> : 
                    p.doctor
                  }
                </td>
                <td style={{color:'var(--muted)',fontSize:'12px'}}>{p.lastCI}</td>
                <td><div style={{display:'flex',gap:'5px'}}>
                  <button className="btn btn-ghost btn-xs" onClick={() => onViewPatient(p.id)}>View</button>
                  {p.doctor === '—' ? 
                    <button className="btn btn-amber btn-xs" onClick={() => onAssignDoctor(p.id)}>Assign</button> : 
                    <>
                      <button className="btn btn-red btn-xs" onClick={() => onSuspendPatient(p.id)}>Suspend</button>
                      <button className="btn btn-gray btn-xs" onClick={() => onRemovePatient(p.id)}>Remove</button>
                    </>
                  }
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;