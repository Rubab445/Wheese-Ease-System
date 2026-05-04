import { X, User, Mail, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import '../Admin.module.css/UserManagement.css'

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Patient',
    status: 'Active'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new user:', formData);
    // TODO: API call to create user
    onClose();
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Patient',
      status: 'Active'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-user-modal-container add-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New User</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="add-user-modal-content">
          <form onSubmit={handleSubmit} className="add-user-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="user@wheeze.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Shield size={16} />
                  Role
                </label>
                <select
                  name="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Account Status</label>
                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
