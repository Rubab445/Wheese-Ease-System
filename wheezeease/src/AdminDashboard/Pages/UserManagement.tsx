import { useState } from 'react';
import { Search, Plus, Users, UserCheck, UserX, Activity } from 'lucide-react';
import UserTable from '../Components/UserTable';
import UserActionsDrawer from '../Components/UserActionsDrawer';
import AddUserModal from '../Components/AddUserModal';
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

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const users: User[] = [
    {
      id: 'USR-001',
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@wheeze.com',
      role: 'Doctor',
      status: 'Active',
      lastActivity: '2 hours ago',
      avatar: 'SM'
    },
    {
      id: 'USR-002',
      name: 'Admin Ahmad',
      email: 'Ahmad@wheeze.com',
      role: 'Admin',
      status: 'Active',
      lastActivity: '5 minutes ago',
      avatar: 'AT'
    },
    {
      id: 'USR-003',
      name: 'Ahmed Khan',
      email: 'ahmed.khan@patient.com',
      role: 'Patient',
      status: 'Active',
      lastActivity: '1 day ago',
      avatar: 'AK'
    },
    {
      id: 'USR-004',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@wheeze.com',
      role: 'Doctor',
      status: 'Suspended',
      lastActivity: '3 days ago',
      avatar: 'MC'
    },
    {
      id: 'USR-005',
      name: 'Sara Malik',
      email: 'sara.malik@patient.com',
      role: 'Patient',
      status: 'Pending',
      lastActivity: 'Never',
      avatar: 'SM'
    },
  ];

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'Active').length,
    suspendedUsers: users.filter(u => u.status === 'Suspended').length,
    admins: users.filter(u => u.role === 'Admin').length,
    doctors: users.filter(u => u.role === 'Doctor').length,
    patients: users.filter(u => u.role === 'Patient').length,
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="user-management-page">
      <div className="user-management-header">
        <div className="header-left">
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage users, roles, and access control</p>
        </div>
        <button className="btn-add-user" onClick={() => setIsAddUserModalOpen(true)}>
          <Plus size={20} />
          Add New User
        </button>
      </div>

      <div className="user-stats-grid">
        <div className="stat-card gradient-blue">
          <div className="stat-icon-wrapper">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">{stats.totalUsers}</h3>
            <span className="stat-badge">All Registered</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-green">
          <div className="stat-icon-wrapper">
            <UserCheck size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Users</p>
            <h3 className="stat-value">{stats.activeUsers}</h3>
            <span className="stat-badge">Currently Online</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-red">
          <div className="stat-icon-wrapper">
            <UserX size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Suspended</p>
            <h3 className="stat-value">{stats.suspendedUsers}</h3>
            <span className="stat-badge">Access Blocked</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-purple">
          <div className="stat-icon-wrapper">
            <Activity size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Role Distribution</p>
            <div className="role-chips">
              <span className="role-chip">{stats.admins} Admins</span>
              <span className="role-chip">{stats.doctors} Doctors</span>
              <span className="role-chip">{stats.patients} Patients</span>
            </div>
          </div>
          <div className="stat-decoration"></div>
        </div>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Patient">Patient</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <UserTable users={filteredUsers} onUserClick={handleUserClick} />

      <UserActionsDrawer
        isOpen={isDrawerOpen}
        user={selectedUser}
        onClose={handleCloseDrawer}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
}
