import type { Patient } from '../types';
import { Eye, Edit, Archive, AlertCircle } from 'lucide-react';
import '../Admin.module.css/PatientManagement.css'

interface PatientDataTableProps {
  patients: Patient[];
  onPatientClick: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
}

export default function PatientDataTable({ patients, onPatientClick, onEditPatient }: PatientDataTableProps) {
  const handleView = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    onPatientClick(patient);
  };

  const handleEdit = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    onEditPatient(patient);
  };

  const handleArchive = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to archive ${patient.name}'s medical records?`)) {
      alert(`${patient.name} has been archived. Records preserved for audit.`);
      console.log('Archive patient:', patient.id);
      // TODO: API call to archive patient
    }
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', class: 'aqi-good' };
    if (aqi <= 100) return { label: 'Moderate', class: 'aqi-moderate' };
    if (aqi <= 150) return { label: 'Unhealthy', class: 'aqi-unhealthy' };
    return { label: 'Hazardous', class: 'aqi-hazardous' };
  };

  return (
    <div className="patient-table-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Patient Identity</th>
            <th>AI Risk Level</th>
            <th>Location & AQI</th>
            <th>Assigned Doctor</th>
            <th>Last Attack</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                <p>No patients found matching your criteria</p>
              </td>
            </tr>
          ) : (
            patients.map((patient) => {
              const aqiInfo = getAQILevel(patient.aqi);
              return (
                <tr
                  key={patient.id}
                  onClick={() => onPatientClick(patient)}
                  className="patient-row"
                >
                  <td>
                    <div className="patient-identity">
                      <div className="patient-avatar">{patient.avatar}</div>
                      <div className="patient-info">
                        <span className="patient-name">{patient.name}</span>
                        <span className="patient-details">
                          {patient.age} years • {patient.gender} • {patient.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="risk-badge-container">
                      <span className={`risk-badge risk-${patient.riskLevel.toLowerCase()}`}>
                        <AlertCircle size={14} />
                        {patient.riskLevel}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="location-aqi-cell">
                      <span className="location-text">{patient.location}</span>
                      <span className={`aqi-badge ${aqiInfo.class}`}>
                        {patient.aqi}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="doctor-name">{patient.assignedDoctor}</span>
                  </td>
                  <td>
                    <span className="last-attack-time">{patient.lastAttack}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-icon view"
                        onClick={(e) => handleView(e, patient)}
                        title="View Medical History"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-icon edit"
                        onClick={(e) => handleEdit(e, patient)}
                        title="Edit Patient"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-icon archive"
                        onClick={(e) => handleArchive(e, patient)}
                        title="Archive Patient"
                      >
                        <Archive size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
