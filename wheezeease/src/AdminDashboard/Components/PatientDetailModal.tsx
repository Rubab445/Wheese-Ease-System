import { X, User, Mail, Phone, Calendar, MapPin, Activity, Heart, Wind, AlertCircle } from 'lucide-react';
import '../Admin.module.css/DoctorManagement.css'

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  address?: string;
  condition: string;
  lastVisit: string;
  nextAppointment?: string;
  bloodType?: string;
  allergies?: string[];
  currentMedication?: string[];
}

interface PatientDetailModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
}

export default function PatientDetailModal({ isOpen, patient, onClose }: PatientDetailModalProps) {
  if (!isOpen || !patient) return null;

  // Extended patient data for demo
  const fullPatientData = {
    ...patient,
    email: patient.email || `${patient.name.toLowerCase().replace(/\s+/g, '.')}@patient.com`,
    phone: patient.phone || '+1 (555) 987-6543',
    age: patient.age || 35,
    gender: patient.gender || 'Male',
    address: patient.address || '123 Main Street, New York, NY 10001',
    nextAppointment: patient.nextAppointment || 'May 15, 2026 at 2:00 PM',
    bloodType: patient.bloodType || 'O+',
    allergies: patient.allergies || ['Pollen', 'Dust Mites', 'Pet Dander'],
    currentMedication: patient.currentMedication || ['Albuterol Inhaler', 'Montelukast 10mg', 'Cetirizine 10mg']
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container patient-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Patient Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="patient-profile-header">
            <div className="patient-avatar-large">
              {fullPatientData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="patient-header-info">
              <h3 className="patient-profile-name">{fullPatientData.name}</h3>
              <p className="patient-profile-id">{fullPatientData.id}</p>
              <div className="patient-condition-badge">
                <Activity size={14} />
                {fullPatientData.condition}
              </div>
            </div>
          </div>

          <div className="patient-info-grid">
            <div className="patient-info-card">
              <Mail size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">{fullPatientData.email}</span>
              </div>
            </div>

            <div className="patient-info-card">
              <Phone size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Phone</span>
                <span className="info-value">{fullPatientData.phone}</span>
              </div>
            </div>

            <div className="patient-info-card">
              <User size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Age & Gender</span>
                <span className="info-value">{fullPatientData.age} years, {fullPatientData.gender}</span>
              </div>
            </div>

            <div className="patient-info-card">
              <Heart size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Blood Type</span>
                <span className="info-value">{fullPatientData.bloodType}</span>
              </div>
            </div>

            <div className="patient-info-card full-width">
              <MapPin size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Address</span>
                <span className="info-value">{fullPatientData.address}</span>
              </div>
            </div>
          </div>

          <div className="patient-detail-section">
            <h4 className="detail-section-title">
              <Calendar size={18} />
              Appointment Information
            </h4>
            <div className="appointment-info">
              <div className="appointment-item">
                <span className="appointment-label">Last Visit</span>
                <span className="appointment-value">{fullPatientData.lastVisit}</span>
              </div>
              <div className="appointment-item">
                <span className="appointment-label">Next Appointment</span>
                <span className="appointment-value highlight">{fullPatientData.nextAppointment}</span>
              </div>
            </div>
          </div>

          <div className="patient-detail-section">
            <h4 className="detail-section-title">
              <AlertCircle size={18} />
              Allergies
            </h4>
            <div className="allergies-list">
              {fullPatientData.allergies.map((allergy, index) => (
                <span key={index} className="allergy-tag">
                  {allergy}
                </span>
              ))}
            </div>
          </div>

          <div className="patient-detail-section">
            <h4 className="detail-section-title">
              <Wind size={18} />
              Current Medication
            </h4>
            <div className="medication-list">
              {fullPatientData.currentMedication.map((med, index) => (
                <div key={index} className="medication-item">
                  <div className="medication-dot"></div>
                  <span className="medication-name">{med}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
