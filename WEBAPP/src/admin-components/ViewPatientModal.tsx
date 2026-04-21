// src/components/ViewPatientModal.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import type{ Patient, Doctor } from '../types';

interface ViewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  doctors: Doctor[];
  onAssignDoctor: (patientId: string) => void;
  onSuspendPatient: (patientId: string) => void;
  onNotifyDoctor: (patientId: string) => void;
  onShowToast: (msg: string) => void;
}

const ViewPatientModal: React.FC<ViewPatientModalProps> = ({ 
  isOpen, 
  onClose, 
  patient, 
  doctors, 
  onAssignDoctor, 
  onSuspendPatient, 
  onNotifyDoctor,
  onShowToast 
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!patient) return null;

  const riskColorClass = () => {
    if (patient.risk >= 61) return 'badge-red';
    if (patient.risk >= 31) return 'badge-amber';
    return 'badge-green';
  };

  const riskLabel = () => {
    if (patient.risk >= 61) return 'High Risk';
    if (patient.risk >= 31) return 'Moderate Risk';
    return 'Low Risk';
  };

  const riskColorValue = () => {
    if (patient.risk >= 61) return 'var(--red)';
    if (patient.risk >= 31) return 'var(--amber)';
    return 'var(--green)';
  };

  // Generate last 7 days risk scores for chart
  const last7DaysRisks = [18, 32, 45, 62, 55, 48, patient.risk];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderTabContent = () => {
    switch(activeTab) {
      case 0:
        return (
          <div style={{ padding: '18px 20px' }}>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-val">{patient.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">City</span>
              <span className="info-val">{patient.city}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Assigned Doctor</span>
              <span className="info-val">
                {patient.doctor === '—' ? 
                  <span style={{ color: 'var(--red)' }}>⚠️ None assigned</span> : 
                  patient.doctor
                }
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Condition</span>
              <span className="info-val">{patient.cond}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Medication</span>
              <span className="info-val">{patient.med}</span>
            </div>
            <div className="info-row" style={{ border: 'none' }}>
              <span className="info-label">Last Check-in</span>
              <span className="info-val">{patient.lastCI}</span>
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ padding: '18px 20px' }}>
            <div className="info-row">
              <span className="info-label">Risk Score</span>
              <span className="info-val" style={{ color: riskColorValue(), fontWeight: '800' }}>
                {patient.risk}% — {riskLabel()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Current Medication</span>
              <span className="info-val">{patient.med}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Inhaler Use</span>
              <span className="info-val">Today (4 times)</span>
            </div>
            <div className="info-row">
              <span className="info-label">Symptoms Today</span>
              <span className="info-val">Wheezing, Shortness of breath</span>
            </div>
            <div className="info-row" style={{ border: 'none' }}>
              <span className="info-label">Mood</span>
              <span className="info-val">😟 Bad</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
              Last 7 days risk scores
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px', marginBottom: '16px' }}>
              {last7DaysRisks.map((risk, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ 
                    width: '100%', 
                    borderRadius: '3px 3px 0 0', 
                    height: `${(risk / 80) * 70}px`, 
                    background: risk >= 61 ? 'var(--red)' : (risk >= 31 ? 'var(--amber)' : 'var(--green)'),
                    opacity: i === 6 ? 1 : 0.6
                  }}></div>
                  <div style={{ fontSize: '9px', color: 'var(--dim)' }}>{days[i]}</div>
                </div>
              ))}
            </div>
            <div className="info-row">
              <span className="info-label">Best Day (this week)</span>
              <span className="info-val" style={{ color: 'var(--green)' }}>Monday — 18%</span>
            </div>
            <div className="info-row" style={{ border: 'none' }}>
              <span className="info-label">Worst Day (this week)</span>
              <span className="info-val" style={{ color: 'var(--red)' }}>Today — {patient.risk}%</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getFooterButtons = () => {
    if (patient.doctor === '—') {
      return (
        <>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-amber" onClick={() => onAssignDoctor(patient.id)}>
            🔗 Assign Doctor
          </button>
        </>
      );
    }
    return (
      <>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={() => onNotifyDoctor(patient.id)}>
          📧 Notify Doctor
        </button>
        <button className="btn btn-red" onClick={() => onSuspendPatient(patient.id)}>
          Suspend Patient
        </button>
      </>
    );
  };

  return (
    <Modal id="viewPatientModal" title={`Patient Profile — ${patient.name}`} size="lg" isOpen={isOpen} onClose={onClose} footer={getFooterButtons()}>
      <div className="detail-cover" style={{ background: `linear-gradient(135deg, ${patient.color}, #1e3a5f)` }}>
        <div className="detail-av-lg" style={{ background: patient.color }}>{patient.init}</div>
        <div>
          <div className="detail-panel-name">{patient.name}</div>
          <div className="detail-panel-sub">{patient.id} · {patient.cond} · {patient.age}y · {patient.gender === 'F' ? 'Female' : 'Male'}</div>
          <div style={{ marginTop: '8px' }}>
            <span className="badge" style={{ background: `${riskColorValue()}22`, color: riskColorValue(), border: `1px solid ${riskColorValue()}44` }}>
              {riskLabel()} · {patient.risk}%
            </span>
          </div>
        </div>
      </div>
      <div className="detail-tabs">
        <div className={`detail-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>Profile</div>
        <div className={`detail-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Health Info</div>
        <div className={`detail-tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>History</div>
      </div>
      {renderTabContent()}
    </Modal>
  );
};

export default ViewPatientModal;