// src/components/ViewDoctorModal.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import type{ Doctor, Patient } from '../types';

interface ViewDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  patients: Patient[];
  onSuspend: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onMessageDoctor: (id: string) => void;
  onShowToast: (msg: string) => void;
}

const ViewDoctorModal: React.FC<ViewDoctorModalProps> = ({ 
  isOpen, 
  onClose, 
  doctor, 
  patients, 
  onSuspend, 
  onApprove, 
  onReject, 
  onMessageDoctor,
  onShowToast 
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!doctor) return null;

  const statusBadge = () => {
    if (doctor.status === 'active') return <span className="badge badge-green">Active</span>;
    if (doctor.status === 'pending') return <span className="badge badge-amber">Pending Approval</span>;
    if (doctor.status === 'inactive') return <span className="badge badge-red">Inactive</span>;
    return <span className="badge badge-gray">Suspended</span>;
  };

  const doctorPatients = patients.filter(p => p.doctor === doctor.name || p.doctor.startsWith(doctor.name.split(' ').slice(0, 2).join(' ')));

  const renderTabContent = () => {
    switch(activeTab) {
      case 0:
        return (
          <div style={{ padding: '18px 20px' }}>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-val">{doctor.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-val">{doctor.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Hospital</span>
              <span className="info-val">{doctor.hosp}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Specialty</span>
              <span className="info-val">{doctor.spec}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Joined</span>
              <span className="info-val">{doctor.joined}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Assigned Patients</span>
              <span className="info-val">{doctor.patients}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Avg Response Time</span>
              <span className="info-val">{doctor.response}</span>
            </div>
            <div className="info-row" style={{ border: 'none' }}>
              <span className="info-label">Status</span>
              <span className="info-val">{statusBadge()}</span>
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ padding: '18px 20px' }}>
            {doctorPatients.length > 0 ? doctorPatients.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="tbl-av" style={{ background: p.color }}>{p.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.cond} · {p.age}y</div>
                </div>
                <span className={`badge ${p.risk >= 61 ? 'badge-red' : p.risk >= 31 ? 'badge-amber' : 'badge-green'}`}>
                  {p.risk >= 61 ? 'High' : p.risk >= 31 ? 'Moderate' : 'Low'} · {p.risk}%
                </span>
              </div>
            )) : (
              <div style={{ color: 'var(--dim)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No patients assigned yet
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div style={{ padding: '18px 20px' }}>
            <div className="info-row">
              <span className="info-label">Avg Response Time</span>
              <span className="info-val" style={{ 
                color: doctor.response === '4 min' || doctor.response === '7 min' ? 'var(--green)' : 
                       doctor.response === '—' ? 'var(--dim)' : 'var(--amber)' 
              }}>
                {doctor.response}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Total Patients</span>
              <span className="info-val">{doctor.patients}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Completion Rate</span>
              <span className="info-val">94%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Patient Satisfaction</span>
              <span className="info-val">⭐ 4.8/5</span>
            </div>
            <div className="info-row" style={{ border: 'none' }}>
              <span className="info-label">Last Active</span>
              <span className="info-val">{doctor.status === 'inactive' ? '7+ days ago' : 'Today'}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getFooterButtons = () => {
    if (doctor.status === 'pending') {
      return (
        <>
          <button className="btn btn-red" onClick={() => { onReject?.(doctor.id); onClose(); onShowToast(`❌ ${doctor.name} rejected`); }}>
            ✕ Reject
          </button>
          <button className="btn btn-green" onClick={() => { onApprove?.(doctor.id); onClose(); onShowToast(`✅ ${doctor.name} approved`); }}>
            ✓ Approve
          </button>
        </>
      );
    }
    if (doctor.status === 'active') {
      return (
        <>
          <button className="btn btn-primary" onClick={() => { onMessageDoctor(doctor.id); onClose(); }}>
            💬 Message Doctor
          </button>
          <button className="btn btn-red" onClick={() => { onSuspend(doctor.id); onClose(); }}>
            Suspend
          </button>
        </>
      );
    }
    if (doctor.status === 'suspended') {
      return (
        <button className="btn btn-green" onClick={() => { onShowToast(`✅ ${doctor.name} reactivated`); onClose(); }}>
          Reactivate
        </button>
      );
    }
    return (
      <button className="btn btn-green" onClick={() => { onShowToast(`📧 Reactivation email sent to ${doctor.name}`); onClose(); }}>
        Send Reactivation Email
      </button>
    );
  };

  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>Close</button>
      {getFooterButtons()}
    </>
  );

  return (
    <Modal id="viewDoctorModal" title={`Doctor Profile — ${doctor.name}`} size="lg" isOpen={isOpen} onClose={onClose} footer={footer}>
      <div className="detail-cover" style={{ background: doctor.color }}>
        <div className="detail-av-lg">{doctor.init}</div>
        <div>
          <div className="detail-panel-name">{doctor.name}</div>
          <div className="detail-panel-sub">{doctor.spec} · {doctor.hosp}</div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            {statusBadge()}
            <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>{doctor.id}</span>
          </div>
        </div>
      </div>
      <div className="detail-tabs">
        <div className={`detail-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>Overview</div>
        <div className={`detail-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Patients ({doctor.patients})</div>
        <div className={`detail-tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>Performance</div>
      </div>
      {renderTabContent()}
    </Modal>
  );
};

export default ViewDoctorModal;