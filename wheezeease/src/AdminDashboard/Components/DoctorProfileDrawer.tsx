import { X, Mail, Phone, GraduationCap, Calendar, Users, Clock, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import PatientDetailModal from './PatientDetailModal';
import '../Admin.module.css/DoctorManagement.css'

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseId: string;
  experience: number;
  status: 'Verified' | 'Pending' | 'Suspended';
  avatar: string;
  phone: string;
  activePatients: number;
  consultationHours: string;
  education: string;
  bio: string;
  joinDate: string;
}

interface Patient {
  id: string;
  name: string;
  lastVisit: string;
  condition: string;
}

interface DoctorProfileDrawerProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export default function DoctorProfileDrawer({ isOpen, doctor, onClose }: DoctorProfileDrawerProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState(false);

  if (!isOpen || !doctor) return null;

  const recentPatients: Patient[] = [
    { id: 'PT-1024', name: 'Ahmed Khan', lastVisit: '2 hours ago', condition: 'Asthma' },
    { id: 'PT-1025', name: 'Sara Malik', lastVisit: '1 day ago', condition: 'Allergic Rhinitis' },
    { id: 'PT-1026', name: 'Omar Hassan', lastVisit: '2 days ago', condition: 'COPD' },
    { id: 'PT-1027', name: 'Fatima Ali', lastVisit: '3 days ago', condition: 'Seasonal Allergies' },
  ];

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientDetailOpen(true);
  };

  const handleClosePatientDetail = () => {
    setIsPatientDetailOpen(false);
    setSelectedPatient(null);
  };

  const handleVerify = () => {
    console.log(`Verify doctor: ${doctor.id}`);
  };

  const handleSuspend = () => {
    if (window.confirm(`Are you sure you want to suspend ${doctor.name}?`)) {
      console.log(`Suspend doctor: ${doctor.id}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container doctor-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Doctor Profile</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="doctor-profile-header">
            <div className="profile-avatar-large">{doctor.avatar}</div>
            <div className="profile-header-info">
              <h3 className="profile-name">{doctor.name}</h3>
              <p className="profile-specialization">{doctor.specialization}</p>
              <span className={`status-badge ${doctor.status.toLowerCase()}`}>
                <span className="status-dot"></span>
                {doctor.status}
              </span>
            </div>
          </div>

          <div className="profile-bio-section">
            <p className="profile-bio">{doctor.bio}</p>
          </div>

          <div className="profile-details-grid">
            <div className="detail-item">
              <Mail size={18} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-value">{doctor.email}</span>
              </div>
            </div>

            <div className="detail-item">
              <Phone size={18} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{doctor.phone}</span>
              </div>
            </div>

            <div className="detail-item">
              <GraduationCap size={18} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Education</span>
                <span className="detail-value">{doctor.education}</span>
              </div>
            </div>

            <div className="detail-item">
              <Shield size={18} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">License ID</span>
                <span className="detail-value">{doctor.licenseId}</span>
              </div>
            </div>

            <div className="detail-item">
              <Calendar size={18} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Join Date</span>
                <span className="detail-value">{new Date(doctor.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="detail-item">
              <Clock size={18} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Consultation Hours</span>
                <span className="detail-value">{doctor.consultationHours}</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h4 className="section-title">
              <Users size={18} />
              Active Patients ({doctor.activePatients})
            </h4>
            <div className="patients-list">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="patient-item clickable"
                  onClick={() => handlePatientClick(patient)}
                >
                  <div className="patient-info">
                    <span className="patient-name">{patient.name}</span>
                    <span className="patient-id">{patient.id}</span>
                  </div>
                  <div className="patient-meta">
                    <span className="patient-condition">{patient.condition}</span>
                    <span className="patient-visit">{patient.lastVisit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h4 className="section-title">Quick Actions</h4>
            <div className="action-buttons">
              {doctor.status === 'Pending' && (
                <button className="action-btn verify" onClick={handleVerify}>
                  <CheckCircle size={18} />
                  Verify Credentials
                </button>
              )}
              {doctor.status === 'Verified' && (
                <button className="action-btn suspend" onClick={handleSuspend}>
                  <XCircle size={18} />
                  Suspend Doctor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PatientDetailModal
        isOpen={isPatientDetailOpen}
        patient={selectedPatient}
        onClose={handleClosePatientDetail}
      />
    </div>
  );
}
