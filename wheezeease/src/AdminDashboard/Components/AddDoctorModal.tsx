import { X, User, Mail, Phone, GraduationCap, Shield, Stethoscope, Clock } from 'lucide-react';
import { useState } from 'react';
import '../Admin.module.css/DoctorManagement.css'
interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDoctorModal({ isOpen, onClose }: AddDoctorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Pulmonology',
    licenseId: '',
    education: '',
    experience: '',
    consultationHours: '',
    status: 'Pending'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering new doctor:', formData);
    // TODO: API call to register doctor
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: 'Pulmonology',
      licenseId: '',
      education: '',
      experience: '',
      consultationHours: '',
      status: 'Pending'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container add-doctor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Register New Doctor</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit} className="add-doctor-form">
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
                  placeholder="Dr. John Smith"
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
                  placeholder="doctor@wheeze.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Stethoscope size={16} />
                  Specialization
                </label>
                <select
                  name="specialization"
                  className="form-input"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Allergy & Immunology">Allergy & Immunology</option>
                  <option value="Pediatric Pulmonology">Pediatric Pulmonology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Respiratory Therapy">Respiratory Therapy</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Shield size={16} />
                  Medical License ID
                </label>
                <input
                  type="text"
                  name="licenseId"
                  className="form-input"
                  placeholder="MED-12345"
                  value={formData.licenseId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <GraduationCap size={16} />
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  className="form-input"
                  placeholder="MD, University Name"
                  value={formData.education}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  className="form-input"
                  placeholder="10"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} />
                  Consultation Hours
                </label>
                <input
                  type="text"
                  name="consultationHours"
                  className="form-input"
                  placeholder="Mon-Fri, 9:00 AM - 5:00 PM"
                  value={formData.consultationHours}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Verification Status</label>
                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Register Doctor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
