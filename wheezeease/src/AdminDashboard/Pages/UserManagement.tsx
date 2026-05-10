import { useState } from 'react';
import {
  Search, Plus, Users, Stethoscope, UserRound, ShieldCheck,
  Download, Filter, Eye, Pencil, Trash2, CheckSquare,
  ChevronDown, RefreshCw, AlertCircle, X
} from 'lucide-react';
import '../Admin.module.css/UserManagement.css';
import UserDetailPage from './UserDetailPage';
import AddUserModal from '../Components/AddUserModal';
import EditUserModal from '../Components/EditUserModal';

export type UserRole = 'Admin' | 'Doctor' | 'Patient';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deleted';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  dateJoined: string;
  lastLogin: string;
  avatar: string;
  // Doctor extra
  specialization?: string;
  patientsAssigned?: number;
  verified?: boolean;
  experience?: string;
  qualifications?: string;
  hospital?: string;
  pmdc?: string;
  // Patient extra
  condition?: 'Asthma' | 'Allergy' | 'Both';
  severity?: 'Mild' | 'Moderate' | 'Severe';
  assignedDoctor?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  triggers?: string[];
  dob?: string;
  gender?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  // Admin extra
  adminRole?: 'Super Admin' | 'Module Admin';
  permissions?: string[];
}

const MOCK_USERS: AppUser[] = [
  { id: 'USR-001', name: 'Dr. Sarah Mitchell', email: 'sarah.mitchell@wheeze.com', phone: '+92 300 1234567', role: 'Doctor', status: 'Active', dateJoined: '2024-01-15', lastLogin: '2 hours ago', avatar: 'SM', specialization: 'Pulmonologist', patientsAssigned: 24, verified: true, experience: '8 years', qualifications: 'MBBS, FCPS', hospital: 'Shaukat Khanum Hospital', pmdc: 'PMDC-12345' },
  { id: 'USR-002', name: 'Dr. Ahmed Raza', email: 'ahmed.raza@wheeze.com', phone: '+92 333 2345678', role: 'Doctor', status: 'Active', dateJoined: '2024-02-10', lastLogin: '1 day ago', avatar: 'AR', specialization: 'Allergist', patientsAssigned: 18, verified: true, experience: '5 years', qualifications: 'MBBS, MCPS', hospital: 'CMH Lahore', pmdc: 'PMDC-67890' },
  { id: 'USR-003', name: 'Dr. Michael Chen', email: 'michael.chen@wheeze.com', phone: '+92 321 3456789', role: 'Doctor', status: 'Inactive', dateJoined: '2024-03-05', lastLogin: '3 weeks ago', avatar: 'MC', specialization: 'General Physician', patientsAssigned: 7, verified: false, experience: '3 years', qualifications: 'MBBS', hospital: 'Services Hospital', pmdc: 'PMDC-11223' },
  { id: 'USR-004', name: 'Dr. Fatima Noor', email: 'fatima.noor@wheeze.com', phone: '+92 345 4567890', role: 'Doctor', status: 'Active', dateJoined: '2024-01-20', lastLogin: '5 hours ago', avatar: 'FN', specialization: 'Pulmonologist', patientsAssigned: 31, verified: true, experience: '10 years', qualifications: 'MBBS, FCPS, FRCP', hospital: 'Jinnah Hospital', pmdc: 'PMDC-33445' },
  { id: 'USR-005', name: 'Ahmed Khan', email: 'ahmed.khan@patient.com', phone: '+92 300 5678901', role: 'Patient', status: 'Active', dateJoined: '2024-02-20', lastLogin: '1 day ago', avatar: 'AK', condition: 'Asthma', severity: 'Moderate', assignedDoctor: 'Dr. Sarah Mitchell', riskLevel: 'Medium', triggers: ['Pollen', 'Dust'], dob: '1990-05-15', gender: 'Male', city: 'Lahore', emergencyContact: 'Ali Khan', emergencyPhone: '+92 301 1111111' },
  { id: 'USR-006', name: 'Sara Malik', email: 'sara.malik@patient.com', phone: '+92 333 6789012', role: 'Patient', status: 'Active', dateJoined: '2024-03-10', lastLogin: '3 hours ago', avatar: 'SM', condition: 'Allergy', severity: 'Mild', assignedDoctor: 'Dr. Ahmed Raza', riskLevel: 'Low', triggers: ['Smoke'], dob: '1995-08-22', gender: 'Female', city: 'Gujrat', emergencyContact: 'Hina Malik', emergencyPhone: '+92 302 2222222' },
  { id: 'USR-007', name: 'Hassan Malik', email: 'hassan.malik@patient.com', phone: '+92 321 7890123', role: 'Patient', status: 'Suspended', dateJoined: '2024-01-30', lastLogin: '2 months ago', avatar: 'HM', condition: 'Both', severity: 'Severe', assignedDoctor: 'Dr. Fatima Noor', riskLevel: 'High', triggers: ['Pollen', 'Dust', 'Smoke'], dob: '1985-11-10', gender: 'Male', city: 'Rawalpindi', emergencyContact: 'Zara Malik', emergencyPhone: '+92 303 3333333' },
  { id: 'USR-008', name: 'Ayesha Khan', email: 'ayesha.khan@patient.com', phone: '+92 345 8901234', role: 'Patient', status: 'Active', dateJoined: '2024-04-01', lastLogin: '6 hours ago', avatar: 'AK', condition: 'Asthma', severity: 'Moderate', assignedDoctor: 'Dr. Sarah Mitchell', riskLevel: 'Medium', triggers: ['Dust'], dob: '1998-02-14', gender: 'Female', city: 'Faisalabad', emergencyContact: 'Imran Khan', emergencyPhone: '+92 304 4444444' },
  { id: 'USR-009', name: 'Harper Nelson', email: 'harper@wheeze.com', phone: '+92 300 9012345', role: 'Admin', status: 'Active', dateJoined: '2023-12-01', lastLogin: '10 minutes ago', avatar: 'HN', adminRole: 'Super Admin', permissions: ['Users', 'Environmental', 'AI Monitoring', 'Reports', 'Settings'] },
  { id: 'USR-010', name: 'Admin Ahmad', email: 'ahmad@wheeze.com', phone: '+92 333 0123456', role: 'Admin', status: 'Active', dateJoined: '2024-01-05', lastLogin: '1 hour ago', avatar: 'AA', adminRole: 'Module Admin', permissions: ['Users', 'Reports'] },
];

const ROLE_COLORS: Record<UserRole, string> = {
  Doctor: '#2563EB',
  Patient: '#059669',
  Admin: '#7C3AED',
};

const STATUS_CONFIG: Record<UserStatus, { color: string; bg: string; label: string }> = {
  Active: { color: '#059669', bg: '#ECFDF5', label: 'Active' },
  Inactive: { color: '#DC2626', bg: '#FEF2F2', label: 'Inactive' },
  Suspended: { color: '#D97706', bg: '#FFFBEB', label: 'Suspended' },
  Deleted: { color: '#6B7280', bg: '#F3F4F6', label: 'Deleted' },
};

export default function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [activeTab, setActiveTab] = useState<'All' | UserRole>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [auditLog, setAuditLog] = useState<{ action: string; time: string }[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addAudit = (action: string) => {
    setAuditLog(prev => [{ action, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 49)]);
  };

  const activeUsers = users.filter(u => u.status !== 'Deleted');
  const trashedUsers = users.filter(u => u.status === 'Deleted');

  const stats = {
    total: activeUsers.length,
    doctors: activeUsers.filter(u => u.role === 'Doctor').length,
    patients: activeUsers.filter(u => u.role === 'Patient').length,
    admins: activeUsers.filter(u => u.role === 'Admin').length,
    active: activeUsers.filter(u => u.status === 'Active').length,
    inactive: activeUsers.filter(u => u.status !== 'Active').length,
  };

  const filteredUsers = (showTrash ? trashedUsers : activeUsers).filter(u => {
    const matchTab = activeTab === 'All' || u.role === activeTab;
    const matchSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchDate = (!dateFrom || u.dateJoined >= dateFrom) && (!dateTo || u.dateJoined <= dateTo);
    return matchTab && matchSearch && matchStatus && matchDate;
  });

  const handleView = (user: AppUser) => { setSelectedUser(user); setViewMode('detail'); };
  const handleBack = () => { setSelectedUser(null); setViewMode('list'); };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Deleted' as UserStatus } : u));
    addAudit(`Soft-deleted user ${id}`);
    showToast('User moved to trash');
  };

  const handleRestore = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Inactive' as UserStatus } : u));
    addAudit(`Restored user ${id}`);
    showToast('User restored');
  };

  const handleHardDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAudit(`Permanently deleted user ${id}`);
    showToast('User permanently deleted');
  };

  const handleAddUser = (user: AppUser) => {
    setUsers(prev => [...prev, user]);
    addAudit(`Created new ${user.role}: ${user.name}`);
    showToast(`${user.role} "${user.name}" added successfully`);
  };

  const handleEditUser = (updated: AppUser) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    addAudit(`Edited user ${updated.id}: ${updated.name}`);
    showToast('User updated successfully');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    setUsers(prev => prev.map(u => {
      if (!selectedIds.includes(u.id)) return u;
      if (action === 'activate') return { ...u, status: 'Active' as UserStatus };
      if (action === 'deactivate') return { ...u, status: 'Inactive' as UserStatus };
      if (action === 'delete') return { ...u, status: 'Deleted' as UserStatus };
      return u;
    }));
    addAudit(`Bulk ${action} on ${selectedIds.length} users`);
    showToast(`Bulk ${action} applied to ${selectedIds.length} users`);
    setSelectedIds([]);
  };

  const exportCSV = () => {
    const rows = [['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Date Joined'], ...filteredUsers.map(u => [u.id, u.name, u.email, u.phone, u.role, u.status, u.dateJoined])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'users.csv'; a.click();
    addAudit(`Exported ${filteredUsers.length} users to CSV`);
  };

  if (viewMode === 'detail' && selectedUser) {
    return <UserDetailPage user={selectedUser} onBack={handleBack} onEdit={(u) => { setEditUser(u); setViewMode('list'); }} />;
  }

  const tabCounts = {
    All: activeUsers.length,
    Doctor: stats.doctors,
    Patient: stats.patients,
    Admin: stats.admins,
  };

  return (
    <div className="um-page">
      {/* Toast */}
      {toast && <div className="um-toast"><AlertCircle size={14} />{toast}</div>}

      {/* Header */}
      <div className="um-header">
        <div>
          <h1 className="um-title">User Management</h1>

        </div>
        <div className="um-header-actions">
          <button className="um-btn-secondary" onClick={() => setShowTrash(!showTrash)}>
            <Trash2 size={16} />{showTrash ? 'Back to Users' : `Trash (${trashedUsers.length})`}
          </button>
          <button className="um-btn-primary" onClick={() => setIsAddOpen(true)}>
            <Plus size={16} />Add New User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="um-stats-grid">
        <div className="um-stat-card um-stat-blue">
          <div className="um-stat-icon"><Users size={22} /></div>
          <div className="um-stat-body">
            <div className="um-stat-value">{stats.total}</div>
            <div className="um-stat-label">Total Users</div>
            <div className="um-stat-sub">{stats.active} Active · {stats.inactive} Inactive</div>
          </div>
        </div>
        <div className="um-stat-card um-stat-teal">
          <div className="um-stat-icon"><Stethoscope size={22} /></div>
          <div className="um-stat-body">
            <div className="um-stat-value">{stats.doctors}</div>
            <div className="um-stat-label">Total Doctors</div>
            <div className="um-stat-sub">{activeUsers.filter(u => u.role === 'Doctor' && u.status === 'Active').length} Active · {activeUsers.filter(u => u.role === 'Doctor' && u.status !== 'Active').length} Inactive</div>
          </div>
        </div>
        <div className="um-stat-card um-stat-purple">
          <div className="um-stat-icon"><UserRound size={22} /></div>
          <div className="um-stat-body">
            <div className="um-stat-value">{stats.patients}</div>
            <div className="um-stat-label">Total Patients</div>
            <div className="um-stat-sub">{activeUsers.filter(u => u.role === 'Patient' && u.status === 'Active').length} Active · {activeUsers.filter(u => u.role === 'Patient' && u.status !== 'Active').length} Inactive</div>
          </div>
        </div>
        <div className="um-stat-card um-stat-orange">
          <div className="um-stat-icon"><ShieldCheck size={22} /></div>
          <div className="um-stat-body">
            <div className="um-stat-value">{stats.admins}</div>
            <div className="um-stat-label">Total Admins</div>
            <div className="um-stat-sub">{activeUsers.filter(u => u.role === 'Admin' && u.status === 'Active').length} Active · {activeUsers.filter(u => u.role === 'Admin' && u.status !== 'Active').length} Inactive</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="um-filter-bar">
        <div className="um-search-box">
          <Search size={16} className="um-search-icon" />
          <input className="um-search-input" placeholder="Search name, email, phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="um-filters">
          <div className="um-select-wrap">
            <Filter size={14} />
            <select className="um-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown size={14} />
          </div>
          <input type="date" className="um-date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From date" />
          <span className="um-date-sep">→</span>
          <input type="date" className="um-date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} title="To date" />
          <button className="um-btn-icon" onClick={() => { setSearchQuery(''); setStatusFilter('All'); setDateFrom(''); setDateTo(''); }} title="Clear filters">
            <RefreshCw size={15} />
          </button>
          <button className="um-btn-export" onClick={exportCSV}><Download size={15} />Export CSV</button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="um-bulk-bar">
          <span><CheckSquare size={15} />{selectedIds.length} selected</span>
          <button className="um-bulk-btn green" onClick={() => bulkAction('activate')}>Activate</button>
          <button className="um-bulk-btn yellow" onClick={() => bulkAction('deactivate')}>Deactivate</button>
          <button className="um-bulk-btn red" onClick={() => bulkAction('delete')}>Delete</button>
          <button className="um-bulk-btn gray" onClick={exportCSV}>Export Selected</button>
          <button className="um-bulk-btn outline" onClick={() => setSelectedIds([])}>Clear</button>
        </div>
      )}

      {/* Role Tabs */}
      <div className="um-tabs">
        {(['All', 'Doctor', 'Patient', 'Admin'] as const).map(tab => (
          <button key={tab} className={`um-tab ${activeTab === tab ? 'um-tab-active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'All' ? <Users size={16} /> : tab === 'Doctor' ? <Stethoscope size={16} /> : tab === 'Patient' ? <UserRound size={16} /> : <ShieldCheck size={16} />} {tab === 'All' ? 'All Users' : `${tab}s`}
            <span className="um-tab-count">{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? filteredUsers.map(u => u.id) : [])} checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0} /></th>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              {(activeTab === 'All' || activeTab === 'Doctor') && <th>Specialization</th>}
              {activeTab === 'Doctor' && <><th>Patients</th><th>Verified</th></>}
              {activeTab === 'Patient' && <><th>Condition</th><th>Risk</th><th>Assigned Doctor</th></>}
              <th>Date Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={14} className="um-empty">No users found</td></tr>
            ) : filteredUsers.map((user, i) => {
              const sc = STATUS_CONFIG[user.status];
              return (
                <tr key={user.id} className={selectedIds.includes(user.id) ? 'um-row-selected' : ''}>
                  <td><input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleSelect(user.id)} /></td>
                  <td className="um-serial">{i + 1}</td>
                  <td>
                    <div className="um-user-cell">
                      <div className="um-avatar" style={{ background: ROLE_COLORS[user.role] + '22', color: ROLE_COLORS[user.role] }}>{user.avatar}</div>
                      <span className="um-user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="um-email">{user.email}</td>
                  <td className="um-phone">{user.phone}</td>
                  <td>
                    <span className="um-role-badge" style={{ background: ROLE_COLORS[user.role] + '18', color: ROLE_COLORS[user.role] }}>{user.role}</span>
                  </td>
                  <td>
                    <span className="um-status-badge" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </td>
                  {(activeTab === 'All' || activeTab === 'Doctor') && (
                    <td className="um-spec">{user.specialization || (user.adminRole ?? '—')}</td>
                  )}
                  {activeTab === 'Doctor' && (
                    <>
                      <td className="um-center">{user.patientsAssigned ?? '—'}</td>
                      <td className="um-center">{user.verified ? <span className="um-verified" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckSquare size={14} /> Verified</span> : <span className="um-pending" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={14} /> Pending</span>}</td>
                    </>
                  )}
                  {activeTab === 'Patient' && (
                    <>
                      <td><span className="um-condition-badge">{user.condition ?? '—'}</span></td>
                      <td>
                        {user.riskLevel && (
                          <span className={`um-risk um-risk-${user.riskLevel.toLowerCase()}`}>{user.riskLevel}</span>
                        )}
                      </td>
                      <td className="um-doctor-name">{user.assignedDoctor ?? '—'}</td>
                    </>
                  )}
                  <td className="um-date">{user.dateJoined}</td>
                  <td>
                    <div className="um-actions">
                      {showTrash ? (
                        <>
                          <button className="um-action-btn restore" onClick={() => handleRestore(user.id)} title="Restore"><RefreshCw size={14} /> Restore</button>
                          <button className="um-action-btn danger" onClick={() => handleHardDelete(user.id)} title="Delete permanently"><X size={14} /> Delete</button>
                        </>
                      ) : (
                        <>
                          <button className="um-action-btn view" onClick={() => handleView(user)} title="View"><Eye size={14} /></button>
                          <button className="um-action-btn edit" onClick={() => setEditUser(user)} title="Edit"><Pencil size={14} /></button>
                          <button className="um-action-btn del" onClick={() => handleDelete(user.id)} title="Delete"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Audit Log */}
      {auditLog.length > 0 && (
        <div className="um-audit">
          <h4 className="um-audit-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckSquare size={16} /> Audit Log</h4>
          {auditLog.slice(0, 5).map((entry, i) => (
            <div key={i} className="um-audit-entry">
              <span className="um-audit-time">{entry.time}</span>
              <span className="um-audit-action">{entry.action}</span>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isAddOpen && <AddUserModal onClose={() => setIsAddOpen(false)} onAdd={handleAddUser} />}
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleEditUser} />}
    </div>
  );
}
