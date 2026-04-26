// src/components/AssignDoctorModal.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import type{ Patient, Doctor } from '../types';

interface AssignDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  doctors: Doctor[];
  onConfirmAssign: (patientId: string, doctorId: string, reason: string, note: string) => void;
  onShowToast: (msg: string) => void;
}

const AssignDoctorModal: React.FC<AssignDoctorModalProps> = ({ 
  isOpen, 
  onClose, 
  patient, 
  doctors, 
  onConfirmAssign, 
  onShowToast 
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [assignReason, setAssignReason] = useState<string>('');
  const [assignNote, setAssignNote] = useState<string>('');

  if (!patient) return null;

  const getRecommendedSpec = (cond: string): string => {
    const c = cond.toLowerCase();
    if (c.includes('asthma') || c.includes('copd')) return 'Pulmonologist';
    if (c.includes('allergy') || c.includes('allergic')) return 'Allergist';
    return 'General Physician';
  };

  const recommendedSpec = getRecommendedSpec(patient.cond);
  
  // Sort doctors: matched specialty first, then by patient load
  const sortedDoctors = [...doctors.filter(d => d.status === 'active')].sort((a, b) => {
    const aMatch = a.spec.toLowerCase().includes(recommendedSpec.toLowerCase());
    const bMatch = b.spec.toLowerCase().includes(recommendedSpec.toLowerCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return a.patients - b.patients;
  });

  const handleConfirm = () => {
    if (!selectedDoctorId) {
      onShowToast('⚠️ Please select a doctor');
      return;
    }
    if (!assignReason) {
      onShowToast('⚠️ Please select a reason for admin assignment');
      return;
    }
    onConfirmAssign(patient.id, selectedDoctorId, assignReason, assignNote);
    onClose();
    setSelectedDoctorId('');
    setAssignReason('');
    setAssignNote('');
  };

  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleConfirm}>Assign Doctor</button>
    </>
  );

  return (
    <Modal id="assignDoctorModal" title="🔗 Admin Override — Assign Doctor" size="md" isOpen={isOpen} onClose={onClose} footer={footer}>
      {/* Why is admin doing this */}
      <div style={{ background: 'var(--amber-lt)', border: '1px solid rgba(217,119,6,.2)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--amber)', marginBottom: '6px' }}>⚠️ Why is this patient unassigned?</div>
        <select 
          className="field-input field-select" 
          value={assignReason}
          onChange={e => setAssignReason(e.target.value)}
          style={{ marginBottom: 0, background: 'var(--white)' }}
        >
          <option value="">Select a reason…</option>
          <option value="suspended">Their previously assigned doctor was suspended</option>
          <option value="skipped">Patient skipped doctor selection during onboarding</option>
          <option value="left">Doctor left the platform</option>
          <option value="manual">Patient was added manually by admin</option>
          <option value="other">Other reason</option>
        </select>
      </div>

      {/* Patient summary */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>Patient</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="tbl-av" style={{ background: patient.color, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff' }}>{patient.init}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>{patient.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>{patient.id} · {patient.cond} · {patient.age}y · {patient.city}</div>
          </div>
          <span className={`badge ${patient.risk >= 61 ? 'badge-red' : patient.risk >= 31 ? 'badge-amber' : 'badge-green'}`}>
            {patient.risk >= 61 ? 'High' : patient.risk >= 31 ? 'Moderate' : 'Low'} · {patient.risk}%
          </span>
        </div>
      </div>

      {/* Condition-matched doctor list */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
          Recommended Doctors
          <span style={{ fontSize: '10px', color: 'var(--blue)', fontWeight: '600', textTransform: 'none', letterSpacing: 0, marginLeft: '6px' }}>
            — matched to {patient.cond}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
          {sortedDoctors.map(doctor => {
            const isMatch = doctor.spec.toLowerCase().includes(recommendedSpec.toLowerCase());
            const isSelected = doctor.id === selectedDoctorId;
            const loadColor = doctor.patients <= 5 ? 'var(--green)' : doctor.patients <= 10 ? 'var(--amber)' : 'var(--red)';
            
            return (
              <div 
                key={doctor.id}
                onClick={() => setSelectedDoctorId(doctor.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  border: `2px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--blue-lt)' : 'var(--white)',
                  cursor: 'pointer', 
                  transition: 'all .15s' 
                }}
              >
                <div className="tbl-av" style={{ background: doctor.color, width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#fff' }}>{doctor.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{doctor.name}</span>
                    {isMatch && <span className="badge badge-blue" style={{ fontSize: '9px', padding: '2px 7px' }}>✓ Best Match</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{doctor.spec} · {doctor.hosp}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: loadColor }}>{doctor.patients} patients</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Avg response: {doctor.response}</div>
                </div>
                {isSelected && <div style={{ fontSize: '18px' }}>✅</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Note to doctor */}
      <div style={{ marginTop: '14px' }}>
        <label className="field-label">Note to Doctor (auto-sent on assignment)</label>
        <textarea 
          className="field-input" 
          rows={2} 
          style={{ resize: 'none' }} 
          placeholder="e.g. Patient's previous doctor was suspended. Please review their history."
          value={assignNote}
          onChange={e => setAssignNote(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default AssignDoctorModal;