import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Calendar, Clock, Edit2, ToggleLeft, ToggleRight, ShieldCheck, Activity, CheckSquare, AlertTriangle, Zap } from 'lucide-react';
import type { AppUser } from './UserManagement';
import '../Admin.module.css/UserManagement.css';

interface Props {
  user: AppUser;
  onBack: () => void;
  onEdit: (u: AppUser) => void;
}

const RISK_COLORS: Record<string, string> = { Low: '#059669', Medium: '#D97706', High: '#DC2626' };
const ROLE_COLORS: Record<string, string> = { Doctor: '#2563EB', Patient: '#059669', Admin: '#7C3AED' };

export default function UserDetailPage({ user, onBack, onEdit }: Props) {
  const [status, setStatus] = useState(user.status);

  const toggleStatus = () => {
    setStatus(prev => prev === 'Active' ? 'Inactive' : 'Active');
  };

  const roleColor = ROLE_COLORS[user.role] || '#475569';

  return (
    <div className="udp-page">
      {/* Header */}
      <div className="udp-header">
        <button className="udp-back-btn" onClick={onBack}><ArrowLeft size={16} /> Back to Users</button>
        <div className="udp-header-actions">
          <button className="udp-edit-btn" onClick={() => onEdit(user)}><Edit2 size={14} /> Edit Profile</button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="udp-profile-card">
        <div className="udp-avatar-section">
          <div className="udp-big-avatar" style={{ background: roleColor + '18', color: roleColor }}>
            {user.avatar}
          </div>
          <div>
            <h2 className="udp-name">{user.name}</h2>
            <div className="udp-badges-row">
              <span className="udp-role-badge" style={{ background: roleColor + '14', color: roleColor, border: `1px solid ${roleColor}33` }}>{user.role}</span>
              {user.verified && <span className="udp-verified-badge"><CheckSquare size={13}/> Verified</span>}
              <span className={`udp-status-pill ${status === 'Active' ? 'udp-status-active' : 'udp-status-inactive'}`}>
                {status === 'Active' ? '● Active' : '● Inactive'}
              </span>
            </div>
          </div>
        </div>
        <div className="udp-status-toggle">
          <span className="udp-status-label">Account Status</span>
          <button className="udp-toggle-btn" onClick={toggleStatus}>
            {status === 'Active' ? <><ToggleRight size={26} color="#059669" /> <span style={{ color: '#059669' }}>Active</span></> : <><ToggleLeft size={26} color="#DC2626" /> <span style={{ color: '#DC2626' }}>Inactive</span></>}
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="udp-info-grid">
        {/* Contact Info */}
        <div className="udp-info-card">
          <h3 className="udp-section-title">Contact Information</h3>
          <div className="udp-info-rows">
            <div className="udp-info-row"><div className="udp-icon-box udp-icon-blue"><Mail size={15} /></div><div><span>Email</span><strong>{user.email}</strong></div></div>
            <div className="udp-info-row"><div className="udp-icon-box udp-icon-teal"><Phone size={15} /></div><div><span>Phone</span><strong>{user.phone}</strong></div></div>
            <div className="udp-info-row"><div className="udp-icon-box udp-icon-purple"><Calendar size={15} /></div><div><span>Date Joined</span><strong>{user.dateJoined}</strong></div></div>
            <div className="udp-info-row"><div className="udp-icon-box udp-icon-amber"><Clock size={15} /></div><div><span>Last Login</span><strong>{user.lastLogin}</strong></div></div>
          </div>
        </div>

        {/* Role-specific Info */}
        {user.role === 'Doctor' && (
          <div className="udp-info-card">
            <h3 className="udp-section-title">Doctor Information</h3>
            <div className="udp-info-rows">
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-blue"><Activity size={15} /></div><div><span>Specialization</span><strong>{user.specialization}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-teal"><ShieldCheck size={15} /></div><div><span>PMDC No.</span><strong>{user.pmdc}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-amber"><Clock size={15} /></div><div><span>Experience</span><strong>{user.experience}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-purple"><Calendar size={15} /></div><div><span>Qualifications</span><strong>{user.qualifications}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-rose"><Mail size={15} /></div><div><span>Hospital</span><strong>{user.hospital}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-blue"><Activity size={15} /></div><div><span>Patients Assigned</span><strong>{user.patientsAssigned}</strong></div></div>
            </div>
          </div>
        )}

        {user.role === 'Patient' && (
          <div className="udp-info-card">
            <h3 className="udp-section-title">Medical Information</h3>
            <div className="udp-info-rows">
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-blue"><Activity size={15} /></div><div><span>Condition</span><strong>{user.condition}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-amber"><ShieldCheck size={15} /></div><div><span>Severity</span><strong>{user.severity}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-rose"><AlertTriangle size={15} /></div><div><span>Risk Level</span><strong style={{ color: RISK_COLORS[user.riskLevel!] }}>{user.riskLevel}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-teal"><Phone size={15} /></div><div><span>Assigned Doctor</span><strong>{user.assignedDoctor}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-purple"><Calendar size={15} /></div><div><span>Date of Birth</span><strong>{user.dob}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-amber"><Mail size={15} /></div><div><span>City</span><strong>{user.city}</strong></div></div>
            </div>
          </div>
        )}

        {user.role === 'Admin' && (
          <div className="udp-info-card">
            <h3 className="udp-section-title">Admin Information</h3>
            <div className="udp-info-rows">
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-purple"><ShieldCheck size={15} /></div><div><span>Admin Role</span><strong>{user.adminRole}</strong></div></div>
              <div className="udp-info-row"><div className="udp-icon-box udp-icon-blue"><Zap size={15} /></div><div><span>Permissions</span><strong>{user.permissions?.join(', ')}</strong></div></div>
            </div>
          </div>
        )}
      </div>

      {/* Extra sections */}
      {user.role === 'Patient' && user.triggers && (
        <div className="udp-tags-card">
          <h3 className="udp-section-title">Known Triggers</h3>
          <div className="udp-tags">
            {user.triggers.map(t => <span key={t} className="udp-tag">{t}</span>)}
          </div>
        </div>
      )}

      {user.role === 'Patient' && (
        <div className="udp-emergency-card">
          <h3 className="udp-section-title">Emergency Contact</h3>
          <div className="udp-info-rows">
            <div className="udp-info-row"><div className="udp-icon-box udp-icon-rose"><Mail size={15} /></div><div><span>Name</span><strong>{user.emergencyContact}</strong></div></div>
            <div className="udp-info-row"><div className="udp-icon-box udp-icon-rose"><Phone size={15} /></div><div><span>Phone</span><strong>{user.emergencyPhone}</strong></div></div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="udp-activity-card">
        <h3 className="udp-section-title">Recent Activity</h3>
        {[
          { time: '2 hours ago', action: 'Logged in from Lahore, Pakistan' },
          { time: '1 day ago', action: 'Updated profile information' },
          { time: '3 days ago', action: 'Password changed' },
          { time: '1 week ago', action: 'Account created' },
        ].map((log, i) => (
          <div key={i} className="udp-activity-row">
            <span className="udp-activity-dot" />
            <span className="udp-activity-time">{log.time}</span>
            <span className="udp-activity-text">{log.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
