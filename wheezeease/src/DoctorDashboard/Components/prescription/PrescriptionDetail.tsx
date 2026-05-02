// PrescriptionDetail.tsx - Clean & Structured
import React, { useState } from 'react';
import type { Patient, Medication, DrugSuggestion, AIAlert } from '../../../types/prescription';
import { ArrowLeft, Printer, Send, Plus, X, ChevronDown, ChevronUp, Search, User, Calendar, Stethoscope, Activity, Save } from 'lucide-react';

const DRUGS: DrugSuggestion[] = [
  { name: "Seretide Accuhaler (500/50 mcg)", cat: "controller", dose: "1 puff twice daily" },
  { name: "Salbutamol 100 mcg (Ventolin)", cat: "reliever", dose: "2 puffs as needed" },
  { name: "Budesonide Inhaler 200 mcg", cat: "controller", dose: "1-2 puffs twice daily" },
  { name: "Formoterol 12 mcg", cat: "controller", dose: "1 puff twice daily" },
  { name: "Tiotropium (Spiriva) 18 mcg", cat: "controller", dose: "1 capsule daily" },
  { name: "Montelukast 10 mg", cat: "controller", dose: "1 tablet nightly" },
];

const AI_ALERTS: AIAlert[] = [
  { id: 1, title: "🌿 High Pollen Alert", message: "Grass pollen is Critical (AQI 148). Consider increasing dose.", severity: "critical", backgroundColor: "#fee2e2", borderColor: "#dc2626", textColor: "#dc2626" },
  { id: 2, title: "📉 Poor Controller Adherence", message: "Seretide adherence is 68% — below 80% threshold.", severity: "critical", backgroundColor: "#fee2e2", borderColor: "#dc2626", textColor: "#dc2626" },
  { id: 3, title: "⚡ Reliever Overuse Detected", message: "Salbutamol used 3× today. Indicates uncontrolled asthma.", severity: "warning", backgroundColor: "#fef3c7", borderColor: "#d97706", textColor: "#d97706" }
];

interface PrescriptionDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PrescriptionDetail: React.FC<PrescriptionDetailProps> = ({ patient, onBack }) => {
  const [sessionMeds, setSessionMeds] = useState<Medication[]>([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState<'idle' | 'draft' | 'sent'>('idle');
  const [signed, setSigned] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({ drug: '', dosage: '', frequency: '', duration: '', instructions: '' });
  const [signatureData, setSignatureData] = useState({ name: '', pin: '' });
  const [alerts, setAlerts] = useState(AI_ALERTS);

  const existingMeds: Medication[] = [
    { id: 1, name: "Seretide Accuhaler", category: "controller", dosage: "500/50 mcg", frequency: "2 puffs · twice daily", duration: "Ongoing", adherence: 68, status: "active", lastTaken: ["Today, 08:02 AM", "Yesterday, 07:55 AM"] },
    { id: 2, name: "Salbutamol (Ventolin)", category: "reliever", dosage: "100 mcg/puff", frequency: "2 puffs · as needed", duration: "Ongoing", adherence: 90, status: "active", lastTaken: ["Today, 09:40 AM", "Today, 07:20 AM"] },
    { id: 3, name: "Montelukast", category: "controller", dosage: "10 mg tablet", frequency: "1 tablet · nightly", duration: "Ongoing", adherence: 82, status: "active", lastTaken: ["Yesterday, 10:00 PM", "28 Apr, 10:15 PM"] }
  ];

  const toggleRow = (id: number) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  const getCategoryBadge = (category: string) => {
    const styles: any = { controller: { bg: "#d1fae5", color: "#065f46", text: "Controller" }, reliever: { bg: "#fee2e2", color: "#b91c1c", text: "Reliever" }, biologic: { bg: "#ede9fe", color: "#5b21b6", text: "Biologic" } };
    const s = styles[category];
    return <span style={{ background: s.bg, color: s.color, padding: "0.2rem 0.6rem", borderRadius: "2rem", fontSize: "0.65rem", fontWeight: 700 }}>{s.text}</span>;
  };

  const filterDrugs = () => DRUGS.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectDrug = (drug: DrugSuggestion) => { setFormData({ ...formData, drug: drug.name, dosage: drug.dose }); setSearchTerm(drug.name); setShowDropdown(false); };
  const validateForm = () => formData.drug && formData.dosage && formData.frequency && formData.duration;
  const addToSession = () => {
    if (!validateForm()) return;
    setSessionMeds([...sessionMeds, { id: Date.now(), name: formData.drug, category: "controller", dosage: formData.dosage, frequency: formData.frequency, duration: formData.duration, adherence: 0, status: "draft" }]);
    setFormData({ drug: '', dosage: '', frequency: '', duration: '', instructions: '' });
    setSearchTerm('');
    setPrescriptionStatus('draft');
  };
  const removeMed = (id: number) => { setSessionMeds(sessionMeds.filter(m => m.id !== id)); if (sessionMeds.length === 1) setPrescriptionStatus('idle'); };
  const saveDraft = () => alert('Draft saved successfully!');
  const openSignModal = () => setShowModal(true);
  const closeModal = () => { setShowModal(false); setSignatureData({ name: '', pin: '' }); };
  const validateSignature = () => signatureData.name.trim() && signatureData.pin.length >= 4;
  const confirmSign = () => { setSessionMeds(sessionMeds.map(m => ({ ...m, status: 'sent' }))); setSigned(true); setPrescriptionStatus('sent'); closeModal(); };
  const dismissAlert = (id: number) => setAlerts(alerts.filter(a => a.id !== id));
  const printPDF = () => alert('PDF generated successfully!');

  return (
    <div className="prescription-detail-container">
      {/* Back Button Row */}
      <div className="back-button-row">
        <button className="back-button-elegant" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Patients
        </button>
      </div>

      {/* Patient Profile Header */}
      <div className="patient-profile-header">
        <div className="profile-avatar" style={{
          background: patient.severity === 'critical' ? 'linear-gradient(135deg,#dc2626,#f87171)'
            : patient.severity === 'warning' ? 'linear-gradient(135deg,#d97706,#fcd34d)'
            : 'linear-gradient(135deg,#7c3aed,#a78bfa)'
        }}>{patient.initials}</div>
        <div className="profile-info">
          <div className="profile-name-row">
            <h2>{patient.name}</h2>
            <span className={`severity-tag severity-${patient.severity}`}>{patient.severity} Risk</span>
          </div>
          <div className="profile-details-row">
            <span><User size={14} /> {patient.age} yrs</span>
            <span><Calendar size={14} /> {patient.dob}</span>
            <span><Activity size={14} /> {patient.patientId}</span>
          </div>
          <div className="profile-condition"><Stethoscope size={14} /> {patient.condition}</div>
          {patient.vitals && (
            <div className="profile-vitals">
              <span>🩸 SpO₂: <strong>{patient.vitals.spo2}</strong></span>
              <span>🌬️ Peak Flow: <strong>{patient.vitals.peakFlow}</strong></span>
              <span>📋 Status: <strong>{prescriptionStatus === 'sent' ? 'Sent ✓' : prescriptionStatus === 'draft' ? 'Draft' : 'New'}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="detail-two-columns">
        {/* Left Column */}
        <div className="left-column-detail">
          {/* Active Medications */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>💊 Active Medications</h3>
              <span className="med-count">{existingMeds.length} medications</span>
            </div>
            <div className="medications-table-wrapper">
              <table className="medications-table">
                <thead><tr><th>Medication</th><th>Type</th><th>Dosage</th><th>Frequency</th><th>Adherence</th><th></th></tr></thead>
                <tbody>
                  {existingMeds.map(med => (
                    <React.Fragment key={med.id}>
                      <tr className="med-row" onClick={() => toggleRow(med.id)}>
                        <td><strong>{med.name}</strong></td>
                        <td>{getCategoryBadge(med.category)}</td>
                        <td>{med.dosage}</td>
                        <td>{med.frequency}</td>
                        <td><div className="adherence-progress"><div className="adherence-progress-fill" style={{ width: `${med.adherence}%` }}></div><span>{med.adherence}%</span></div></td>
                        <td>{expandedRows[med.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</td>
                      </tr>
                      {expandedRows[med.id] && (
                        <tr className="expanded-row"><td colSpan={6}><div className="last-taken-section"><div className="last-taken-title">Last Taken</div>{med.lastTaken?.map((t, i) => <div key={i} className="last-taken-item">🕐 {t}</div>)}</div></td></tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Prescription */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>📝 New Prescription</h3>
              {prescriptionStatus === 'draft' && <span className="status-draft">Draft</span>}
              {prescriptionStatus === 'sent' && <span className="status-sent">Sent</span>}
            </div>
            <div className="prescription-form">
              <div className="form-row-full">
                <label>Medication *</label>
                <div className="drug-search-container">
                  <Search size={14} />
                  <input type="text" placeholder="Search medication..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} />
                </div>
                {showDropdown && (<div className="drug-dropdown-list">{filterDrugs().map((drug, idx) => (<div key={idx} className="drug-option" onClick={() => selectDrug(drug)}><div><div className="drug-name">{drug.name}</div><div className="drug-dose">{drug.dose}</div></div>{getCategoryBadge(drug.cat)}</div>))}</div>)}
              </div>
              <div className="form-row-2col">
                <div className="form-field"><label>Dosage *</label><input type="text" value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} placeholder="e.g., 2 puffs" /></div>
                <div className="form-field"><label>Frequency *</label><select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}><option value="">Select</option><option>Once daily</option><option>Twice daily</option><option>As needed</option></select></div>
                <div className="form-field"><label>Duration *</label><select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}><option value="">Select</option><option>7 days</option><option>14 days</option><option>1 month</option><option>Ongoing</option></select></div>
                <div className="form-field-full"><label>Instructions</label><textarea rows={2} value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} placeholder="Special instructions for patient..." /></div>
              </div>
              <button className="add-medication-btn" onClick={addToSession} disabled={!validateForm()}><Plus size={16} /> Add to Prescription</button>
            </div>

            {sessionMeds.length > 0 && (
              <div className="session-medications">
                <div className="session-title">Session Medications ({sessionMeds.length})</div>
                {sessionMeds.map(med => (
                  <div key={med.id} className="session-med-item">
                    <div><div className="session-med-name">{med.name}</div><div className="session-med-details">{med.dosage} · {med.frequency} · {med.duration}</div></div>
                    <div className="session-med-actions"><span className="draft-badge">Draft</span><button onClick={() => removeMed(med.id)} className="remove-med"><X size={14} /></button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column-detail">
          <div className="detail-card">
            <div className="detail-card-header"><h3>🤖 AI Assistant</h3><span className="alert-count">{alerts.length} alerts</span></div>
            {alerts.map(alert => (
              <div key={alert.id} className="alert-card-mini" style={{ backgroundColor: alert.backgroundColor, borderLeft: `3px solid ${alert.borderColor}` }}>
                <button className="alert-close" onClick={() => dismissAlert(alert.id)}>✕</button>
                <div className="alert-title-mini" style={{ color: alert.textColor }}>{alert.title}</div>
                <div className="alert-message-mini" style={{ color: alert.textColor }}>{alert.message}</div>
              </div>
            ))}
            <div className="aqi-widget">
              <div className="aqi-widget-header">🌍 Gujrat Air Quality</div>
              <div className="aqi-value-widget"><span className="aqi-number">148</span><span className="aqi-status-badge-widget">Unhealthy</span></div>
              <div className="aqi-tags-widget"><span>🌿 Grass: High</span><span>🌳 Tree: Moderate</span></div>
            </div>
          </div>

          <div className="detail-card signature-card-ui">
            <h3>✍️ Digital Signature</h3>
            <div className="signature-status">
              <div className={`signature-icon-ui ${signed ? 'signed' : sessionMeds.length > 0 ? 'ready' : ''}`}>{signed ? '✅' : '✍️'}</div>
              <div className="signature-text-ui">{signed ? 'Prescription Signed' : sessionMeds.length > 0 ? 'Ready to Sign' : 'Add medications first'}</div>
              {signed && <div className="signature-sub-ui">Dr. {signatureData.name} · {new Date().toLocaleTimeString()}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar-bottom">
        <div className="action-status">{prescriptionStatus === 'draft' && `📝 Draft · ${sessionMeds.length} medication(s)`}{prescriptionStatus === 'sent' && '✅ Prescription sent successfully'}{prescriptionStatus === 'idle' && '➕ Add medications to continue'}</div>
        <div className="action-buttons-bottom">
          <button className="btn-outline" onClick={saveDraft} disabled={sessionMeds.length === 0}><Save size={14} /> Save Draft</button>
          <button className="btn-primary" onClick={openSignModal} disabled={sessionMeds.length === 0 || prescriptionStatus !== 'draft'}><Send size={14} /> E-Sign & Send</button>
          <button className="btn-outline" onClick={printPDF} disabled={prescriptionStatus !== 'sent'}><Printer size={14} /> Print PDF</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom"><div><h3>Digital Signature</h3><p>Authorize prescription for {patient.name}</p></div><button onClick={closeModal} className="modal-close-custom">✕</button></div>
            <div className="modal-body-custom">
              <div className="modal-input-group"><label>Full Name</label><input type="text" placeholder="Dr. Ahmad" value={signatureData.name} onChange={(e) => setSignatureData({ ...signatureData, name: e.target.value })} /></div>
              <div className="modal-input-group"><label>4-Digit PIN</label><input type="password" placeholder="••••" maxLength={4} value={signatureData.pin} onChange={(e) => setSignatureData({ ...signatureData, pin: e.target.value })} /></div>
              <div className="modal-info-box"><span>ℹ️</span><p>By signing, you confirm this prescription is clinically appropriate.</p></div>
            </div>
            <div className="modal-footer-custom"><button className="modal-cancel" onClick={closeModal}>Cancel</button><button className="modal-confirm" onClick={confirmSign} disabled={!validateSignature()}>Confirm & Sign</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionDetail;