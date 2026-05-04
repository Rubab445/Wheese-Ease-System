import { X, User, Mail, Phone, MapPin, Calendar, Heart, UserCog } from 'lucide-react';
import { useState } from 'react';
import '../Admin.module.css/PatientManagement.css'

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterPatientModal({ isOpen, onClose }: RegisterPatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    location: '',
    bloodType: 'O+',
    assignedDoctor: 'Dr. Sarah Mitchell',
    knownTriggers: '',
    currentMedications: '',
    medicalHistory: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering new patient:', formData);
    alert(`Successfully registered ${formData.name} to the system!`);
    // TODO: API call to register patient
    onClose();
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      email: '',
      phone: '',
      location: '',
      bloodType: 'O+',
      assignedDoctor: 'Dr. Sarah Mitchell',
      knownTriggers: '',
      currentMedications: '',
      medicalHistory: ''
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
      <div className="modal-container register-patient-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Register New Patient</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit} className="register-patient-form">
            <div className="form-section">
              <h3 className="form-section-title">Personal Information</h3>
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
                    placeholder="Ahmed Khan"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    className="form-input"
                    placeholder="35"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Gender
                  </label>
                  <select
                    name="gender"
                    className="form-input"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Heart size={16} />
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    className="form-input"
                    value={formData.bloodType}
                    onChange={handleChange}
                    required
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="patient@example.com"
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
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="Gujrat, Pakistan"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Medical Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <UserCog size={16} />
                    Assigned Doctor
                  </label>
                  <select
                    name="assignedDoctor"
                    className="form-input"
                    value={formData.assignedDoctor}
                    onChange={handleChange}
                    required
                  >
                    <option value="Dr. Sarah Mitchell">Dr. Sarah Mitchell</option>
                    <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                    <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                    <option value="Dr. James Wilson">Dr. James Wilson</option>
                    <option value="Dr. Aisha Patel">Dr. Aisha Patel</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Known Triggers</label>
                  <input
                    type="text"
                    name="knownTriggers"
                    className="form-input"
                    placeholder="Smog, Dust, Cold Weather (comma-separated)"
                    value={formData.knownTriggers}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Current Medications</label>
                  <input
                    type="text"
                    name="currentMedications"
                    className="form-input"
                    placeholder="Albuterol Inhaler, Montelukast 10mg (comma-separated)"
                    value={formData.currentMedications}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Medical History Notes</label>
                  <textarea
                    name="medicalHistory"
                    className="form-textarea"
                    placeholder="Enter patient's medical history and relevant notes..."
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Register Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
