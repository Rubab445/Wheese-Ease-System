import { useState } from 'react';
import { Search, Plus, UserCog, CheckCircle, Clock, Stethoscope } from 'lucide-react';
import type { Doctor } from '../types';
import DoctorListTable from '../Components/DoctorListTable';
import DoctorProfileDrawer from '../Components/DoctorProfileDrawer';
import AddDoctorModal from '../Components/AddDoctorModal';
import EditDoctorModal from '../Components/EditDoctorModal';
import '../Admin.module.css/DoctorManagement.css'

export default function DoctorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  const doctors: Doctor[] = [
    {
      id: 'DOC-001',
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@wheeze.com',
      specialization: 'Pulmonology',
      licenseId: 'MED-45678',
      experience: 12,
      status: 'Verified',
      avatar: 'SM',
      phone: '+1 (555) 123-4567',
      activePatients: 45,
      consultationHours: 'Mon-Fri, 9:00 AM - 5:00 PM',
      education: 'MD, Harvard Medical School',
      bio: 'Specialized in respiratory diseases and asthma management with over a decade of experience.',
      joinDate: '2024-01-15'
    },
    {
      id: 'DOC-002',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@wheeze.com',
      specialization: 'Allergy & Immunology',
      licenseId: 'MED-45679',
      experience: 8,
      status: 'Verified',
      avatar: 'MC',
      phone: '+1 (555) 234-5678',
      activePatients: 38,
      consultationHours: 'Mon-Thu, 10:00 AM - 6:00 PM',
      education: 'MD, Johns Hopkins University',
      bio: 'Expert in treating allergic reactions and immunological disorders.',
      joinDate: '2024-02-20'
    },
    {
      id: 'DOC-003',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@wheeze.com',
      specialization: 'Pediatric Pulmonology',
      licenseId: 'MED-45680',
      experience: 6,
      status: 'Pending',
      avatar: 'ER',
      phone: '+1 (555) 345-6789',
      activePatients: 0,
      consultationHours: 'Not Set',
      education: 'MD, Stanford School of Medicine',
      bio: 'Focused on treating respiratory conditions in children.',
      joinDate: '2024-04-28'
    },
    {
      id: 'DOC-004',
      name: 'Dr. James Wilson',
      email: 'james.wilson@wheeze.com',
      specialization: 'General Medicine',
      licenseId: 'MED-45681',
      experience: 15,
      status: 'Verified',
      avatar: 'JW',
      phone: '+1 (555) 456-7890',
      activePatients: 52,
      consultationHours: 'Mon-Sat, 8:00 AM - 4:00 PM',
      education: 'MD, Yale School of Medicine',
      bio: 'General practitioner with extensive experience in respiratory care.',
      joinDate: '2023-11-10'
    },
    {
      id: 'DOC-005',
      name: 'Dr. Aisha Patel',
      email: 'aisha.patel@wheeze.com',
      specialization: 'Pulmonology',
      licenseId: 'MED-45682',
      experience: 10,
      status: 'Verified',
      avatar: 'AP',
      phone: '+1 (555) 567-8901',
      activePatients: 41,
      consultationHours: 'Tue-Sat, 9:00 AM - 5:00 PM',
      education: 'MD, Columbia University',
      bio: 'Specialist in chronic respiratory diseases and preventive care.',
      joinDate: '2024-01-05'
    },
  ];

  const stats = {
    totalDoctors: doctors.length,
    verifiedDoctors: doctors.filter(d => d.status === 'Verified').length,
    pendingVerifications: doctors.filter(d => d.status === 'Pending').length,
    totalPatients: doctors.reduce((sum, d) => sum + d.activePatients, 0),
    pulmonologists: doctors.filter(d => d.specialization === 'Pulmonology' || d.specialization === 'Pediatric Pulmonology').length,
    allergists: doctors.filter(d => d.specialization === 'Allergy & Immunology').length,
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDoctor(null);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setIsEditDoctorModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditDoctorModalOpen(false);
    setDoctorToEdit(null);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.licenseId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = specializationFilter === 'All' || doctor.specialization === specializationFilter;
    const matchesStatus = statusFilter === 'All' || doctor.status === statusFilter;
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  return (
    <div className="doctor-management-page">
      <div className="doctor-management-header">
        <div className="header-left">
          <h1 className="page-title">Doctor Management</h1>
          <p className="page-subtitle">Manage medical professionals and verify credentials</p>
        </div>
        <button className="btn-add-doctor" onClick={() => setIsAddDoctorModalOpen(true)}>
          <Plus size={20} />
          Register New Doctor
        </button>
      </div>

      <div className="doctor-stats-grid">
        <div className="stat-card gradient-blue">
          <div className="stat-icon-wrapper">
            <UserCog size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Doctors</p>
            <h3 className="stat-value">{stats.totalDoctors}</h3>
            <span className="stat-badge">Registered Professionals</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-green">
          <div className="stat-icon-wrapper">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Verified Doctors</p>
            <h3 className="stat-value">{stats.verifiedDoctors}</h3>
            <span className="stat-badge">Credentials Approved</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-amber">
          <div className="stat-icon-wrapper">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Verification</p>
            <h3 className="stat-value">{stats.pendingVerifications}</h3>
            <span className="stat-badge">Awaiting Review</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-purple">
          <div className="stat-icon-wrapper">
            <Stethoscope size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Patients</p>
            <h3 className="stat-value">{stats.totalPatients}</h3>
            <span className="stat-badge">Under Care</span>
          </div>
          <div className="stat-decoration"></div>
        </div>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, license ID..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="All">All Specializations</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Allergy & Immunology">Allergy & Immunology</option>
            <option value="Pediatric Pulmonology">Pediatric Pulmonology</option>
            <option value="General Medicine">General Medicine</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <DoctorListTable
        doctors={filteredDoctors}
        onDoctorClick={handleDoctorClick}
        onEditDoctor={handleEditDoctor}
      />

      <DoctorProfileDrawer
        isOpen={isDrawerOpen}
        doctor={selectedDoctor}
        onClose={handleCloseDrawer}
      />

      <AddDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
      />

      <EditDoctorModal
        isOpen={isEditDoctorModalOpen}
        doctor={doctorToEdit}
        onClose={handleCloseEditModal}
      />
    </div>
  );
}
