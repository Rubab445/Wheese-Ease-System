import { X, User, Mail, Phone, GraduationCap, Shield, Stethoscope, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../Admin.module.css/DoctorManagement.css'

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseId: string;
  experience: number;
  status: 'Verified' | 'Pending' | 'Suspended';
  education: string;
  consultationHours: string;
}

interface EditDoctorModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export default function EditDoctorModal({ isOpen, doctor, onClose }: EditDoctorModalProps) {
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

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        licenseId: doctor.licenseId,
        education: doctor.education,
        experience: doctor.experience.toString(),
        consultationHours: doctor.consultationHours,
        status: doctor.status
      });
    }
  }, [doctor]);

  if (!isOpen || !doctor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating doctor:', { id: doctor.id, ...formData });
    alert(`Successfully updated ${formData.name}'s information!`);
    // TODO: API call to update doctor
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container edit-doctor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Doctor Information</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit} className="edit-doctor-form">
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
