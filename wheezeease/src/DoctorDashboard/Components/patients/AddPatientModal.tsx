import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2 } from 'lucide-react';

interface AddPatientModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPatientModal({ onClose, onSuccess }: AddPatientModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');

  const suggestedTriggers = ['Pollen', 'Dust', 'Smoke', 'Cold Air', 'Pet Dander', 'Mold'];

  const handleAddTrigger = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && triggerInput.trim() !== '') {
      e.preventDefault();
      if (!triggers.includes(triggerInput.trim())) {
        setTriggers([...triggers, triggerInput.trim()]);
      }
      setTriggerInput('');
    }
  };

  const addSuggestedTrigger = (t: string) => {
    if (!triggers.includes(t)) {
      setTriggers([...triggers, t]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="pd-modal-overlay">
      <div className="pd-modal">
        <div className="pd-modal-header">
          <h2>Add New Patient</h2>
          <button className="pd-close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="pd-stepper">
          <div className={`pd-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="pd-step-circle">{step > 1 ? <CheckCircle2 size={16} /> : 1}</div>
            Basic Info
          </div>
          <div style={{flex: 1, height: '1px', background: 'var(--border)', margin: 'auto 0'}} />
          <div className={`pd-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="pd-step-circle">{step > 2 ? <CheckCircle2 size={16} /> : 2}</div>
            Medical Details
          </div>
          <div style={{flex: 1, height: '1px', background: 'var(--border)', margin: 'auto 0'}} />
          <div className={`pd-step ${step === 3 ? 'active' : ''}`}>
            <div className="pd-step-circle">3</div>
            Confirm
          </div>
        </div>

        <div className="pd-modal-body">
          {step === 1 && (
            <div className="pd-form-grid">
              <div className="pd-form-group full">
                <label className="pd-form-label">Profile Photo</label>
                <div className="pd-dropzone">
                  <UploadCloud size={32} style={{margin: '0 auto 12px'}} />
                  <div>Drag and drop image here or click to upload</div>
                </div>
              </div>
              <div className="pd-form-group">
                <label className="pd-form-label">Full Name</label>
                <input className="pd-input" type="text" placeholder="e.g. Jane Doe" />
              </div>
              <div className="pd-form-group">
                <label className="pd-form-label">Email Address</label>
                <input className="pd-input" type="email" placeholder="jane@example.com" />
              </div>
              <div className="pd-form-group">
                <label className="pd-form-label">Phone Number</label>
                <input className="pd-input" type="text" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="pd-form-group">
                <label className="pd-form-label">Date of Birth</label>
                <input className="pd-input" type="date" />
              </div>
              <div className="pd-form-group">
                <label className="pd-form-label">City</label>
                <input className="pd-input" type="text" placeholder="e.g. Seattle" />
              </div>
              <div className="pd-form-group">
                <label className="pd-form-label">Gender</label>
                <div className="pd-pill-group">
                  <label>
                    <input type="radio" name="gender" className="pd-pill-radio" defaultChecked />
                    <div className="pd-pill-label">Female</div>
                  </label>
                  <label>
                    <input type="radio" name="gender" className="pd-pill-radio" />
                    <div className="pd-pill-label">Male</div>
                  </label>
                  <label>
                    <input type="radio" name="gender" className="pd-pill-radio" />
                    <div className="pd-pill-label">Other</div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="pd-form-grid">
              <div className="pd-form-group full">
                <label className="pd-form-label">Condition</label>
                <div className="pd-pill-group">
                  <label>
                    <input type="checkbox" className="pd-pill-radio" defaultChecked />
                    <div className="pd-pill-label teal">Asthma</div>
                  </label>
                  <label>
                    <input type="checkbox" className="pd-pill-radio" />
                    <div className="pd-pill-label violet">Allergy</div>
                  </label>
                </div>
              </div>

              <div className="pd-form-group full">
                <label className="pd-form-label">Severity</label>
                <div className="pd-pill-group">
                  <label>
                    <input type="radio" name="sev" className="pd-pill-radio" />
                    <div className="pd-pill-label" style={{color: 'var(--green)', borderColor: 'var(--green)'}}>Mild</div>
                  </label>
                  <label>
                    <input type="radio" name="sev" className="pd-pill-radio" defaultChecked />
                    <div className="pd-pill-label" style={{color: 'var(--amber)', borderColor: 'var(--amber)'}}>Moderate</div>
                  </label>
                  <label>
                    <input type="radio" name="sev" className="pd-pill-radio" />
                    <div className="pd-pill-label" style={{color: 'var(--rose)', borderColor: 'var(--rose)'}}>Severe</div>
                  </label>
                </div>
              </div>

              <div className="pd-form-group full">
                <label className="pd-form-label">Known Triggers (Press Enter to add)</label>
                <input 
                  className="pd-input" 
                  type="text" 
                  placeholder="Type trigger..." 
                  value={triggerInput}
                  onChange={e => setTriggerInput(e.target.value)}
                  onKeyDown={handleAddTrigger}
                />
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px'}}>
                  {triggers.map(t => (
                    <div key={t} className="pd-tag">
                      {t} <button className="pd-tag-close" onClick={() => setTriggers(triggers.filter(x => x !== t))}><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px'}}>
                  <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>Suggested: </span>
                  {suggestedTriggers.map(t => (
                    <button key={t} type="button" onClick={() => addSuggestedTrigger(t)} style={{background: 'none', border: '1px dashed var(--border)', padding: '2px 8px', borderRadius: '100px', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary)'}}>
                      {t} +
                    </button>
                  ))}
                </div>
              </div>

              <div className="pd-form-group">
                <label className="pd-form-label">Emergency Contact Name</label>
                <input className="pd-input" type="text" placeholder="e.g. John Doe" />
              </div>
              <div className="pd-form-group">
                <label className="pd-form-label">Emergency Contact Phone</label>
                <input className="pd-input" type="text" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="pd-form-grid" style={{background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px'}}>
              <div className="pd-form-group full">
                <h3 style={{margin: '0 0 16px 0', fontFamily: 'Fraunces, serif', fontStyle: 'italic'}}>Summary</h3>
              </div>
              <div>
                <div className="pd-data-label">NAME</div>
                <div className="pd-data-value">Jane Doe</div>
              </div>
              <div>
                <div className="pd-data-label">CONDITION</div>
                <div className="pd-data-value">Asthma</div>
              </div>
              <div>
                <div className="pd-data-label">SEVERITY</div>
                <div className="pd-data-value">Moderate</div>
              </div>
              <div>
                <div className="pd-data-label">TRIGGERS</div>
                <div className="pd-data-value">{triggers.join(', ') || 'None specified'}</div>
              </div>
            </div>
          )}
        </div>

        <div className="pd-modal-footer">
          {step > 1 && (
            <button className="pd-btn-outline" onClick={handleBack}>Back</button>
          )}
          {step < 3 ? (
            <button className="pd-btn-primary" onClick={handleNext}>Next Step</button>
          ) : (
            <button className="pd-btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm & Add Patient'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
