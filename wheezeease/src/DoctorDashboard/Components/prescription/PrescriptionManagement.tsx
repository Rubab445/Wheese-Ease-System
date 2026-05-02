// PrescriptionManagement.tsx
import React, { useState } from 'react';
import PatientGrid from '../../Components/prescription/PatientGrid';
import PrescriptionDetail from '../../Components/prescription/PrescriptionDetail';
import type { Patient } from '../../../types/prescription';
import './Prescription.css';

const PrescriptionManagement: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleBack = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="prescription-management">
      {!selectedPatient ? (
        <PatientGrid onPatientSelect={handlePatientSelect} viewMode={viewMode} setViewMode={setViewMode} />
      ) : (
        <PrescriptionDetail patient={selectedPatient} onBack={handleBack} />
      )}
    </div>
  );
};

export default PrescriptionManagement;