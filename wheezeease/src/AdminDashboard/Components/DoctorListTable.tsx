import type { Doctor } from '../types';
import { Eye, Edit, Trash2 } from 'lucide-react';
import '../Admin.module.css/DoctorManagement.css'

interface DoctorListTableProps {
  doctors: Doctor[];
  onDoctorClick: (doctor: Doctor) => void;
  onEditDoctor: (doctor: Doctor) => void;
}

export default function DoctorListTable({ doctors, onDoctorClick, onEditDoctor }: DoctorListTableProps) {
  const handleView = (e: React.MouseEvent, doctor: Doctor) => {
    e.stopPropagation();
    onDoctorClick(doctor);
  };

  const handleEdit = (e: React.MouseEvent, doctor: Doctor) => {
    e.stopPropagation();
    onEditDoctor(doctor);
  };

  const handleDelete = (e: React.MouseEvent, doctor: Doctor) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${doctor.name} from the system?`)) {
      alert(`${doctor.name} has been removed from the system.`);
      console.log('Delete doctor:', doctor.id);
      // TODO: API call to delete doctor
    }
  };

  return (
    <div className="doctor-table-container">
      <table className="doctor-table">
        <thead>
          <tr>
            <th>Doctor Identity</th>
            <th>License ID</th>
            <th>Experience</th>
            <th>Active Patients</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                <p>No doctors found matching your criteria</p>
              </td>
            </tr>
          ) : (
            doctors.map((doctor) => (
              <tr key={doctor.id} onClick={() => onDoctorClick(doctor)} className="doctor-row">
                <td>
                  <div className="doctor-identity">
                    <div className="doctor-avatar">{doctor.avatar}</div>
                    <div className="doctor-info">
                      <span className="doctor-name">{doctor.name}</span>
                      <span className="doctor-specialization">{doctor.specialization}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="license-id">{doctor.licenseId}</span>
                </td>
                <td>
                  <span className="experience-badge">{doctor.experience} years</span>
                </td>
                <td>
                  <span className="patient-count">{doctor.activePatients}</span>
                </td>
                <td>
                  <span className={`status-badge ${doctor.status.toLowerCase()}`}>
                    <span className="status-dot"></span>
                    {doctor.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-icon view"
                      onClick={(e) => handleView(e, doctor)}
                      title="View Profile"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-icon edit"
                      onClick={(e) => handleEdit(e, doctor)}
                      title="Edit Doctor"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-icon delete"
                      onClick={(e) => handleDelete(e, doctor)}
                      title="Remove Doctor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
