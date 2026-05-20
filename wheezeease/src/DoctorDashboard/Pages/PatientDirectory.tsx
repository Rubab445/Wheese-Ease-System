import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient.types';
import { fetchPatients } from '../../lib/patientService';
import PatientStats from '../Components/patients/PatientsStats';
import PatientFilters from '../Components/patients/PatientsFilter';
import PatientListView from '../Components/patients/PatientTableView';
import PatientInsightsDrawer from '../Components/patients/PatientInsightsDrawer';
import { AddPatientModal, PrescriptionModal } from '../Components/patients/PatientModals';
import { PlusCircle } from 'lucide-react';
import '../../styles/patients.css';

/**
 * NEW Patient Directory
 * This version uses a Side Drawer (PatientInsightsDrawer) for patient details
 * to avoid navigating to a new page.
 */
const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [rxPatient, setRxPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients().then(data => {
      setAllPatients(data);
      setLoadingPatients(false);
    });
  }, []);

  const filteredPatients = useMemo(() => {
    let filtered = allPatients.filter((p: Patient) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      let matchAge = true;
      if (ageFilter === 'child') matchAge = p.age <= 12;
      else if (ageFilter === 'teen') matchAge = p.age >= 13 && p.age <= 17;
      else if (ageFilter === 'adult') matchAge = p.age >= 18 && p.age <= 60;
      else if (ageFilter === 'senior') matchAge = p.age > 60;
      return matchSearch && matchStatus && matchAge;
    });

    if (sortBy === 'risk') {
      const order = { critical: 0, watch: 1, stable: 2 };
      filtered.sort((a: Patient, b: Patient) => order[a.status] - order[b.status]);
    } else if (sortBy === 'name') {
      filtered.sort((a: Patient, b: Patient) => a.name.localeCompare(b.name));
    } else if (sortBy === 'recent') {
      filtered.sort((a: Patient, b: Patient) => a.lastActive.localeCompare(b.lastActive));
    }

    return filtered;
  }, [allPatients, searchTerm, statusFilter, ageFilter, sortBy]);

  const stats = useMemo(() => {
    const activeCount = allPatients.filter((p: Patient) => p.lastActive.includes('h') || p.lastActive === 'today').length;
    const highRiskCount = allPatients.filter((p: Patient) => p.status === 'critical').length;
    const moderateCount = allPatients.filter((p: Patient) => p.status === 'watch').length;
    return {
      total: allPatients.length,
      active: activeCount,
      highRisk: highRiskCount,
      moderate: moderateCount,
    };
  }, []);

  const handlePatientClick = (patient: Patient) => {
    console.log("Opening drawer for:", patient.name);
    setSelectedPatient(patient);
    setIsDrawerOpen(true);
  };

  if (loadingPatients) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 36, height: 36, border: '3px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#6B7280', fontSize: 14 }}>Loading patients from Supabase...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="patients-page-wrapper">
      <div className="page-top-bar">
        <div className="page-title-group">
          <h1>Patient Directory</h1>
          <p>AI-Powered Clinical Oversight · {filteredPatients.length} Patients Total</p>
        </div>
        <button className="btn-primary" style={{ backgroundColor: '#DBEAFE', color: '#2563EB', borderColor: '#BFDBFE' }} onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle size={18} />
          Register New Patient
        </button>
      </div>

      <PatientStats
        totalPatients={stats.total}
        activePatients={stats.active}
        highRiskCount={stats.highRisk}
        moderateCount={stats.moderate}
      />

      <PatientFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        ageFilter={ageFilter}
        onAgeChange={setAgeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <PatientListView
        patients={filteredPatients}
        onPatientClick={handlePatientClick}
        onMessageClick={(p) => navigate(`/messages?patientId=${p.id}`)}
        onPrescriptionClick={(p) => {
          setRxPatient(p);
          setIsRxModalOpen(true);
        }}
      />


      <PatientInsightsDrawer
        isOpen={isDrawerOpen}
        patient={selectedPatient}
        onClose={() => setIsDrawerOpen(false)}
        onSendUrgentAlert={(p) => alert(`Alert ${p.name}`)}
      />

      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => setIsAddModalOpen(false)}
      />

      <PrescriptionModal
        isOpen={isRxModalOpen}
        patient={rxPatient}
        onClose={() => {
          setIsRxModalOpen(false);
          setRxPatient(null);
        }}
        onSave={() => setIsRxModalOpen(false)}
      />
    </div>
  );
};

export default PatientsPage;