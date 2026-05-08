import { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import type { AppUser, UserStatus } from '../Pages/UserManagement';
import '../Admin.module.css/AddEditUserModal.css';

interface Props {
  user: AppUser;
  onClose: () => void;
  onSave: (user: AppUser) => void;
}

const SPECIALIZATIONS = ['Pulmonologist', 'Allergist', 'General Physician', 'Pediatrician', 'ENT Specialist'];
const TRIGGERS_OPTIONS = ['Pollen', 'Dust', 'Smoke', 'Pet Dander', 'Mold', 'Cold Air', 'Exercise'];
const PERMISSIONS_OPTIONS = ['Users', 'Environmental', 'AI Monitoring', 'Reports', 'Settings', 'Dialogs'];

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...user });

  const set = (key: keyof AppUser, val: any) => setForm((prev: AppUser) => ({ ...prev, [key]: val }));

  const toggleTrigger = (t: string) => {
    const current = form.triggers ?? [];
    set('triggers', current.includes(t) ? current.filter((x: string) => x !== t) : [...current, t]);
  };

  const togglePerm = (p: string) => {
    const current = form.permissions ?? [];
    set('permissions', current.includes(p) ? current.filter((x: string) => x !== p) : [...current, p]);
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit User</h2>
            <p className="modal-subtitle">{user.id} — {user.role}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* Common Fields */}
          <div className="form-section-title">Basic Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Account Status</label>
              <select className="form-input" value={form.status} onChange={e => set('status', e.target.value as UserStatus)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Doctor Fields */}
          {user.role === 'Doctor' && (
            <>
              <div className="form-section-title">Doctor Details</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Specialization</label>
                  <select className="form-input" value={form.specialization} onChange={e => set('specialization', e.target.value)}>
                    {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>PMDC Registration No.</label>
                  <input className="form-input" value={form.pmdc ?? ''} onChange={e => set('pmdc', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input className="form-input" value={form.experience ?? ''} onChange={e => set('experience', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Qualifications</label>
                  <input className="form-input" value={form.qualifications ?? ''} onChange={e => set('qualifications', e.target.value)} />
                </div>
                <div className="form-group form-group-full">
                  <label>Hospital / Clinic</label>
                  <input className="form-input" value={form.hospital ?? ''} onChange={e => set('hospital', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Verification Status</label>
                  <select className="form-input" value={form.verified ? 'Verified' : 'Pending'} onChange={e => set('verified', e.target.value === 'Verified')}>
                    <option value="Verified">✅ Verified</option>
                    <option value="Pending">🟡 Pending</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Patient Fields */}
          {user.role === 'Patient' && (
            <>
              <div className="form-section-title">Patient Details</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input className="form-input" type="date" value={form.dob ?? ''} onChange={e => set('dob', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-input" value={form.gender ?? ''} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-input" value={form.city ?? ''} onChange={e => set('city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Medical Condition</label>
                  <select className="form-input" value={form.condition ?? ''} onChange={e => set('condition', e.target.value)}>
                    <option>Asthma</option>
                    <option>Allergy</option>
                    <option>Both</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Severity</label>
                  <select className="form-input" value={form.severity ?? ''} onChange={e => set('severity', e.target.value)}>
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Risk Level</label>
                  <select className="form-input" value={form.riskLevel ?? ''} onChange={e => set('riskLevel', e.target.value)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Doctor</label>
                  <input className="form-input" value={form.assignedDoctor ?? ''} onChange={e => set('assignedDoctor', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input className="form-input" value={form.emergencyContact ?? ''} onChange={e => set('emergencyContact', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Emergency Phone</label>
                  <input className="form-input" value={form.emergencyPhone ?? ''} onChange={e => set('emergencyPhone', e.target.value)} />
                </div>
              </div>
              <div className="form-group form-group-full">
                <label>Known Triggers</label>
                <div className="tag-select">
                  {TRIGGERS_OPTIONS.map(t => (
                    <span key={t} className={`tag-option ${(form.triggers ?? []).includes(t) ? 'tag-active' : ''}`} onClick={() => toggleTrigger(t)}>{t}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Admin Fields */}
          {user.role === 'Admin' && (
            <>
              <div className="form-section-title">Admin Settings</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Admin Role</label>
                  <select className="form-input" value={form.adminRole} onChange={e => set('adminRole', e.target.value)}>
                    <option>Super Admin</option>
                    <option>Module Admin</option>
                  </select>
                </div>
              </div>
              <div className="form-group form-group-full">
                <label>Module Permissions</label>
                <div className="tag-select">
                  {PERMISSIONS_OPTIONS.map(p => (
                    <span key={p} className={`tag-option ${(form.permissions ?? []).includes(p) ? 'tag-active' : ''}`} onClick={() => togglePerm(p)}>{p}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Extra actions */}
          <div className="form-section-title">Security</div>
          <div className="edit-extra-actions">
            <button className="edit-action-btn">
              <RefreshCw size={14} /> Send Password Reset Email
            </button>
          </div>

          <div className="modal-footer">
            <button className="um-btn-secondary" onClick={onClose}>Cancel</button>
            <button className="um-btn-primary" onClick={handleSubmit}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
