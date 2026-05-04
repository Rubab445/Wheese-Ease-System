import { X, Shield, Key, Trash2, UserX, CheckCircle, UserCheck, Clock } from 'lucide-react';
import '../Admin.module.css/UserManagement.css'

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Patient';
  status: 'Active' | 'Suspended' | 'Pending';
  lastActivity: string;
  avatar: string;
}

interface UserActionsDrawerProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export default function UserActionsDrawer({ isOpen, user, onClose }: UserActionsDrawerProps) {
  if (!isOpen || !user) return null;

  const permissions = [
    { id: 'view_patients', label: 'View Patient Records', granted: true },
    { id: 'edit_patients', label: 'Edit Patient Data', granted: user.role === 'Doctor' || user.role === 'Admin' },
    { id: 'view_analytics', label: 'Access Analytics Dashboard', granted: user.role === 'Admin' },
    { id: 'manage_users', label: 'Manage Users', granted: user.role === 'Admin' },
    { id: 'aqi_logs', label: 'Access AQI Logs', granted: true },
    { id: 'ml_predictions', label: 'View ML Predictions', granted: user.role !== 'Patient' },
  ];

  const handleToggleStatus = () => {
    console.log(`Toggle status for user: ${user.id}`);
  };

  const handleResetPassword = () => {
    console.log(`Reset password for user: ${user.id}`);
  };

  const handleDeactivate = () => {
    if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      console.log(`Deactivate user: ${user.id}`);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    console.log(`Toggle permission ${permissionId} for user: ${user.id}`);
  };

  const getStatusIcon = () => {
    switch (user.status) {
      case 'Active':
        return <UserCheck size={18} />;
      case 'Suspended':
        return <UserX size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-actions-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">User Details & Actions</h2>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-content">
          {/* User Profile Section */}
          <div className="user-profile-section">
            <div className="user-avatar-large">
              {user.avatar}
            </div>
            <h3 className="user-name-large">{user.name}</h3>
            <p className="user-email-large">{user.email}</p>
            <div className="user-badges">
              <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
              <span className={`status-badge ${user.status.toLowerCase()}`}>
                {getStatusIcon()}
                {user.status}
              </span>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="drawer-section">
            <div className="section-header">
              <Shield size={20} />
              <h4>Permissions</h4>
            </div>
            <div className="permissions-grid">
              {permissions.map((permission) => (
                <div key={permission.id} className="permission-row">
                  <span className="permission-label">{permission.label}</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={permission.granted}
                      onChange={() => handlePermissionToggle(permission.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="drawer-section">
            <div className="section-header">
              <Key size={20} />
              <h4>Quick Actions</h4>
            </div>
            <div className="actions-grid">
              <button className="action-btn-usermanagement status-user" onClick={handleToggleStatus}>
                {user.status === 'Active' ? (
                  <>
                    <UserX size={18} />
                    Suspend Account
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Activate Account
                  </>
                )}
              </button>
              <button className="action-btn-usermanagement reset" onClick={handleResetPassword}>
                <Key size={18} />
                Reset Password
              </button>
              <button className="action-btn-usermanagement delete" onClick={handleDeactivate}>
                <Trash2 size={18} />
                Deactivate User
              </button>
            </div>
          </div>

          {/* Activity Log Section */}
          <div className="drawer-section">
            <div className="section-header">
              <Clock size={20} />
              <h4>Recent Activity</h4>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">2 hours ago</span>
                <span className="activity-desc">Logged in from 192.168.1.1</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">1 day ago</span>
                <span className="activity-desc">Updated patient record PT-1024</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">2 days ago</span>
                <span className="activity-desc">Accessed environmental data</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">5 days ago</span>
                <span className="activity-desc">Changed password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}