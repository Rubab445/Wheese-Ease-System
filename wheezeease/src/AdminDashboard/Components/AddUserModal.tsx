import { useState } from 'react';
import { X, Stethoscope, UserRound, ShieldCheck, ChevronRight } from 'lucide-react';
import type { AppUser, UserRole, UserStatus } from '../Pages/UserManagement';
import '../Admin.module.css/AddEditUserModal.css';

interface Props {
  onClose: () => void;
  onAdd: (user: AppUser) => void;
}

const SPECIALIZATIONS = ['Pulmonologist', 'Allergist', 'General Physician', 'Pediatrician', 'ENT Specialist'];
const TRIGGERS_OPTIONS = ['Pollen', 'Dust', 'Smoke', 'Pet Dander', 'Mold', 'Cold Air', 'Exercise'];
const PERMISSIONS_OPTIONS = ['Users', 'Environmental', 'AI Monitoring', 'Reports', 'Settings', 'Dialogs'];

export default function AddUserModal({ onClose, onAdd }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', status: 'Active' as UserStatus,
    // Doctor
    specialization: '', pmdc: '', experience: '', qualifications: '', hospital: '',
    // Patient
    dob: '', gender: '', city: '', condition: '', severity: '', assignedDoctor: '', emergencyContact: '', emergencyPhone: '',
    triggers: [] as string[],
    // Admin
    adminRole: 'Module Admin' as 'Super Admin' | 'Module Admin',
    permissions: [] as string[],
  });

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleTrigger = (t: string) => setForm(prev => ({ ...prev, triggers: prev.triggers.includes(t) ? prev.triggers.filter(x => x !== t) : [...prev.triggers, t] }));
  const togglePerm = (p: string) => setForm(prev => ({ ...prev, permissions: prev.permissions.includes(p) ? prev.permissions.filter(x => x !== p) : [...prev.permissions, p] }));

  const handleSubmit = () => {
    if (!role || !form.name || !form.email) return;
    const newUser: AppUser = {
      id: 'USR-' + Date.now().toString().slice(-4),
      name: form.name, email: form.email, phone: form.phone, role,
      status: form.status, dateJoined: new Date().toISOString().slice(0, 10),
      lastLogin: 'Never', avatar: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      ...(role === 'Doctor' && { specialization: form.specialization, pmdc: form.pmdc, experience: form.experience, qualifications: form.qualifications, hospital: form.hospital, patientsAssigned: 0, verified: false }),
      ...(role === 'Patient' && { condition: form.condition as AppUser['condition'], severity: form.severity as AppUser['severity'], assignedDoctor: form.assignedDoctor, riskLevel: 'Low' as AppUser['riskLevel'], triggers: form.triggers, dob: form.dob, gender: form.gender, city: form.city, emergencyContact: form.emergencyContact, emergencyPhone: form.emergencyPhone }),
      ...(role === 'Admin' && { adminRole: form.adminRole, permissions: form.permissions }),
    };
    onAdd(newUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Add New User</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="modal-body">
            <p className="modal-step-label">Step 1 — Select a Role</p>
            <div className="role-cards">
              {([
                { r: 'Doctor', icon: <Stethoscope size={32} />, desc: 'Medical professional managing patients', color: '#2563EB' },
                { r: 'Patient', icon: <UserRound size={32} />, desc: 'Patient registered in the system', color: '#059669' },
                { r: 'Admin', icon: <ShieldCheck size={32} />, desc: 'Administrator with system access', color: '#7C3AED' },
              ] as const).map(({ r, icon, desc, color }) => (
                <div key={r} className={`role-card ${role === r ? 'role-card-selected' : ''}`} onClick={() => setRole(r)} style={{ borderColor: role === r ? color : '#E2E8F0' }}>
                  <div className="role-card-icon" style={{ color, background: color + '15' }}>{icon}</div>
                  <strong>{r}</strong>
                  <p>{desc}</p>
                  {role === r && <span className="role-check" style={{ background: color }}>✓</span>}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="um-btn-secondary" onClick={onClose}>Cancel</button>
              <button className="um-btn-primary" disabled={!role} onClick={() => setStep(2)}>Continue <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 2: Form */}
        {step === 2 && role && (
          <div className="modal-body">
            <p className="modal-step-label">Step 2 — Fill in Details ({role})</p>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Dr. Sarah Mitchell" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 300 0000000" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Doctor fields */}
            {role === 'Doctor' && (
              <div className="form-grid">
                <div className="form-group">
                  <label>Specialization</label>
                  <select className="form-input" value={form.specialization} onChange={e => set('specialization', e.target.value)}>
                    <option value="">Select...</option>
                    {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>PMDC Registration No.</label><input className="form-input" value={form.pmdc} onChange={e => set('pmdc', e.target.value)} placeholder="PMDC-XXXXX" /></div>
                <div className="form-group"><label>Years of Experience</label><input className="form-input" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 5 years" /></div>
                <div className="form-group"><label>Qualifications</label><input className="form-input" value={form.qualifications} onChange={e => set('qualifications', e.target.value)} placeholder="e.g. MBBS, FCPS" /></div>
                <div className="form-group form-group-full"><label>Hospital / Clinic</label><input className="form-input" value={form.hospital} onChange={e => set('hospital', e.target.value)} placeholder="Hospital name" /></div>
              </div>
            )}

            {/* Patient fields */}
            {role === 'Patient' && (
              <>
                <div className="form-grid">
                  <div className="form-group"><label>Date of Birth</label><input className="form-input" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} /></div>
                  <div className="form-group"><label>Gender</label><select className="form-input" value={form.gender} onChange={e => set('gender', e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div>
                  <div className="form-group"><label>City</label><input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Lahore" /></div>
                  <div className="form-group"><label>Medical Condition</label><select className="form-input" value={form.condition} onChange={e => set('condition', e.target.value)}><option value="">Select</option><option>Asthma</option><option>Allergy</option><option>Both</option></select></div>
                  <div className="form-group"><label>Severity</label><select className="form-input" value={form.severity} onChange={e => set('severity', e.target.value)}><option value="">Select</option><option>Mild</option><option>Moderate</option><option>Severe</option></select></div>
                  <div className="form-group"><label>Assign Doctor</label><input className="form-input" value={form.assignedDoctor} onChange={e => set('assignedDoctor', e.target.value)} placeholder="Doctor name" /></div>
                  <div className="form-group"><label>Emergency Contact Name</label><input className="form-input" value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} /></div>
                  <div className="form-group"><label>Emergency Phone</label><input className="form-input" value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} /></div>
                </div>
                <div className="form-group form-group-full">
                  <label>Known Triggers</label>
                  <div className="tag-select">
                    {TRIGGERS_OPTIONS.map(t => (
                      <span key={t} className={`tag-option ${form.triggers.includes(t) ? 'tag-active' : ''}`} onClick={() => toggleTrigger(t)}>{t}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Admin fields */}
            {role === 'Admin' && (
              <>
                <div className="form-grid">
                  <div className="form-group"><label>Admin Role</label>
                    <select className="form-input" value={form.adminRole} onChange={e => set('adminRole', e.target.value)}>
                      <option>Super Admin</option><option>Module Admin</option>
                    </select>
                  </div>
                </div>
                <div className="form-group form-group-full">
                  <label>Module Permissions</label>
                  <div className="tag-select">
                    {PERMISSIONS_OPTIONS.map(p => (
                      <span key={p} className={`tag-option ${form.permissions.includes(p) ? 'tag-active' : ''}`} onClick={() => togglePerm(p)}>{p}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="modal-footer">
              <button className="um-btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="um-btn-primary" onClick={handleSubmit} disabled={!form.name || !form.email}>Create User</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
