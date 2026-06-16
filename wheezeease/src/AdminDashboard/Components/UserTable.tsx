import { MoreVertical, Mail, Calendar } from 'lucide-react';
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

interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
}

export default function UserTable({ users, onUserClick }: UserTableProps) {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'role-badge admin';
      case 'Doctor':
        return 'role-badge doctor';
      case 'Patient':
        return 'role-badge patient';
      default:
        return 'role-badge';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-indicator active';
      case 'Suspended':
        return 'status-indicator suspended';
      case 'Pending':
        return 'status-indicator pending';
      default:
        return 'status-indicator';
    }
  };

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>User Profile</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => onUserClick(user)}>
              <td>
                <div className="user-profile-cell">
                  <div className="user-avatar">{user.avatar}</div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">
                      <Mail size={14} />
                      {user.email}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span className={getRoleBadgeClass(user.role)}>
                  {user.role}
                </span>
              </td>
              <td>
                <div className="activity-cell">
                  <Calendar size={14} />
                  <span>{user.lastActivity}</span>
                </div>
              </td>
              <td>
                <div className="status-cell">
                  <div className={getStatusBadgeClass(user.status)}></div>
                  <span>{user.status}</span>
                </div>
              </td>
              <td>
                <button
                  className="action-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick(user);
                  }}
                >
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="empty-state">
          <p>No users found matching your filters</p>
        </div>
      )}
    </div>
  );
}
