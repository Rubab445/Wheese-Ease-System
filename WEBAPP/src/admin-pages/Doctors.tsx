// src/pages/Doctors.tsx
import React, { useState } from 'react';
import type { Doctor, Patient, NewDoctorData } from '../types';

interface DoctorsProps {
  doctors: Doctor[];
  patients: Patient[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onViewDoctor: (id: string) => void;
  onAddDoctor: (doctor: NewDoctorData) => void;
  onShowToast: (msg: string) => void;
  onOpenAddModal: () => void;
}

const Doctors: React.FC<DoctorsProps> = ({ 
  doctors, 
  onApprove, 
  onReject, 
  onSuspend, 
  onViewDoctor, 
  onAddDoctor,
  onShowToast,
  onOpenAddModal
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = doctors.filter(d => {
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.hosp.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const activeCount = doctors.filter(d => d.status === 'active').length;
  const pendingCount = doctors.filter(d => d.status === 'pending').length;

  const statusBadge = (status: string) => {
    if (status === 'active') return <span className="badge badge-green">Active</span>;
    if (status === 'pending') return <span className="badge badge-amber">Pending</span>;
    if (status === 'inactive') return <span className="badge badge-red">Inactive</span>;
    return <span className="badge badge-gray">Suspended</span>;
  };

  const actionButtons = (d: Doctor) => {
    if (d.status === 'pending') {
      return (
        <div style={{display:'flex',gap:'5px'}}>
          <button className="btn btn-green btn-xs" onClick={() => onApprove(d.id)}>✓ Approve</button>
          <button className="btn btn-red btn-xs" onClick={() => onReject(d.id)}>✕ Reject</button>
        </div>
      );
    }
    if (d.status === 'active') {
      return (
        <div style={{display:'flex',gap:'5px'}}>
          <button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor(d.id)}>View</button>
          <button className="btn btn-red btn-xs" onClick={() => onSuspend(d.id)}>Suspend</button>
        </div>
      );
    }
    if (d.status === 'inactive') {
      return (
        <div style={{display:'flex',gap:'5px'}}>
          <button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor(d.id)}>View</button>
          <button className="btn btn-amber btn-xs" onClick={() => onShowToast(`📧 Reactivation email sent to ${d.name}`)}>Nudge</button>
        </div>
      );
    }
    return (
      <div style={{display:'flex',gap:'5px'}}>
        <button className="btn btn-ghost btn-xs" onClick={() => onViewDoctor(d.id)}>View</button>
        <button className="btn btn-green btn-xs" onClick={() => onShowToast(`✅ ${d.name} reactivated`)}>Reactivate</button>
      </div>
    );
  };

  return (
    <div>
      <div className="page-head">
        <div><h2>Doctor Management</h2><p>Approve, monitor and manage all doctors</p></div>
        <button className="btn btn-primary" onClick={onOpenAddModal}>＋ Add Doctor</button>
      </div>
      <div className="grid4" style={{marginBottom:'20px'}}>
        <div className="stat s-teal"><div className="stat-icon">✅</div><div className="stat-val teal">{activeCount}</div><div className="stat-label">Active</div></div>
        <div className="stat s-amber"><div className="stat-icon">⏳</div><div className="stat-val amber">{pendingCount}</div><div className="stat-label">Pending Approval</div></div>
        <div className="stat s-red"><div className="stat-icon">😴</div><div className="stat-val red">4</div><div className="stat-label">Inactive 7+ days</div></div>
        <div className="stat s-blue"><div className="stat-icon">👥</div><div className="stat-val blue">209</div><div className="stat-label">Patients Assigned</div></div>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">All Doctors</div>
          <div style={{display:'flex',gap:'8px'}}>
            <input 
              className="field-input" 
              style={{width:'200px',padding:'6px 12px'}} 
              placeholder="Search by name…" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
            <select 
              className="field-input field-select" 
              style={{width:'140px',padding:'6px 12px'}} 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Doctor</th><th>Specialty</th><th>Hospital</th><th>Patients</th><th>Avg Response</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div className="tbl-av" style={{background:d.color}}>{d.init}</div>
                  <div>
                    <div style={{fontWeight:'600'}}>{d.name}</div>
                    <div style={{fontSize:'11px',color:'var(--muted)'}}>{d.id}</div>
                  </div>
                </div></td>
                <td style={{color:'var(--muted)'}}>{d.spec}</td>
                <td style={{color:'var(--muted)',fontSize:'12px'}}>{d.hosp}</td>
                <td style={{fontWeight:'600'}}>{d.patients}</td>
                <td>{d.response === '—' ? <span style={{color:'var(--dim)'}}>—</span> : <span className="badge badge-green">{d.response}</span>}</td>
                <td>{statusBadge(d.status)}</td>
                <td>{actionButtons(d)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Doctors;