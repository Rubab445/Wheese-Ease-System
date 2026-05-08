import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Pill, BrainCircuit, Activity } from 'lucide-react';
import type { Patient } from '../../../types/patient.types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      onSave();
    }, 2000);
  };

  return (
    <div className={`p-overlay ${isOpen ? 'open' : ''}`}>
      <div className="p-modal">
        {showSuccess ? (
          <div className="success-check">
            <div className="success-icon">
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Patient Added Successfully</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>The patient can now log symptoms via the mobile app.</p>
          </div>
        ) : (
          <>
            <div className="p-modal-header">
              <div className="p-modal-title">Register New Patient</div>
              <button className="btn-icon" onClick={onClose}><X size={18} /></button>
            </div>

            <div className="p-stepper">
              <div className={`p-step ${step >= 1 ? 'complete' : ''} ${step === 1 ? 'active' : ''}`} />
              <div className={`p-step ${step === 2 ? 'active' : ''}`} />
            </div>

            <div className="p-form-body">
              {step === 1 ? (
                <div className="step-content animate-in">
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-dim)', marginBottom: '16px', textTransform: 'uppercase' }}>Step 1: Basic Information</div>
                  <div className="p-form-group">
                    <label>Full Name</label>
                    <input className="p-form-input" type="text" placeholder="e.g. Sara Ahmed" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="p-form-group">
                      <label>Age</label>
                      <input className="p-form-input" type="number" placeholder="e.g. 34" />
                    </div>
                    <div className="p-form-group">
                      <label>Gender</label>
                      <select className="p-form-input">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-form-group">
                    <label>Contact (Phone or Email)</label>
                    <input className="p-form-input" type="text" placeholder="+92 300 1234567" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button className="btn-primary" onClick={handleNext}>
                      Next Step
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="step-content animate-in">
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-dim)', marginBottom: '16px', textTransform: 'uppercase' }}>Step 2: Medical Baseline</div>
                  <div className="p-form-group">
                    <label>Primary Condition</label>
                    <select className="p-form-input">
                      <option>Asthma</option>
                      <option>COPD</option>
                      <option>Seasonal Allergy</option>
                    </select>
                  </div>
                  <div className="p-form-group">
                    <label>Known Triggers</label>
                    <input className="p-form-input" type="text" placeholder="e.g. Pollen, Dust, Smoke" />
                  </div>
                  <div className="p-form-group">
                    <label>Current Primary Medication</label>
                    <input className="p-form-input" type="text" placeholder="e.g. Ventolin Inhaler" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button className="btn-icon" style={{ padding: '0 16px', gap: '8px' }} onClick={handleBack}>
                      <ChevronLeft size={16} />
                      Back
                    </button>
                    <button className="btn-primary" onClick={handleSave} style={{ background: 'var(--green)' }}>
                      Complete Registration
                      <ShieldCheck size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface PrescriptionModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSave: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  patient,
  onClose,
  onSave,
}) => {
  if (!isOpen || !patient) return null;

  return (
    <div className={`p-overlay ${isOpen ? 'open' : ''}`}>
      <div className="p-modal" style={{ maxWidth: '520px' }}>
        <div className="p-modal-header">
          <div className="p-modal-title">Update Prescription</div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-form-body">
          {/* Current Medication View */}
          <section style={{ marginBottom: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Pill size={12} />
              Current Medication
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Salbutamol Inhaler (Ventolin)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>100mcg · 2 puffs · As needed</div>
          </section>

          {/* New Prescription Entry */}
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '16px' }}>New Prescription Entry</div>
          
          <div className="p-form-group">
            <label>Medication Name</label>
            <select className="p-form-input">
              <option>Ventolin (Salbutamol)</option>
              <option>Symbicort (Budesonide/Formoterol)</option>
              <option>Fluticasone</option>
              <option>Montelukast</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="p-form-group">
              <label>Dosage</label>
              <input className="p-form-input" type="text" placeholder="e.g. 2 puffs" />
            </div>
            <div className="p-form-group">
              <label>Frequency</label>
              <select className="p-form-input">
                <option>Once Daily</option>
                <option>Twice Daily</option>
                <option>Morning & Night</option>
                <option>As Needed</option>
              </select>
            </div>
          </div>

          {/* AI Suggestion Box */}
          <div style={{ padding: '14px', background: '#EEF2FF', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)', marginTop: '8px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--indigo)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BrainCircuit size={14} />
              AI Recommendation
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4' }}>
              Based on recent environmental triggers: <strong>Consider increasing dosage</strong> during high pollen days predicted for next week.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-icon" style={{ flex: 1, height: '44px' }} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={{ flex: 2, height: '44px', justifyContent: 'center' }} onClick={onSave}>
              UPDATE & NOTIFY PATIENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};