// src/components/AddPatientModal.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import type{ NewPatientData, Doctor } from '../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: NewPatientData) => void;
  doctors: Doctor[];
  onShowToast: (msg: string) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddPatient, doctors, onShowToast }) => {
  const [formData, setFormData] = useState<NewPatientData>({
    name: '',
    age: 30,
    gender: 'F',
    condition: 'Asthma',
    phone: '',
    city: '',
    doctorId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.city) {
      onShowToast('⚠️ Please fill all required fields');
      return;
    }
    onAddPatient(formData);
    setFormData({
      name: '',
      age: 30,
      gender: 'F',
      condition: 'Asthma',
      phone: '',
      city: '',
      doctorId: ''
    });
    onClose();
    onShowToast('✅ Patient added successfully');
  };

  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleSubmit}>Add Patient</button>
    </>
  );

  return (
    <Modal id="addPatientModal" title="➕ Add New Patient" size="md" isOpen={isOpen} onClose={onClose} footer={footer}>
      <div className="grid2">
        <div className="field-group">
          <label className="field-label">Full Name *</label>
          <input 
            className="field-input" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Patient name" 
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">Age *</label>
          <input 
            className="field-input" 
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="30" 
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">Gender *</label>
          <select 
            className="field-input field-select" 
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Condition *</label>
          <select 
            className="field-input field-select" 
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option>Asthma</option>
            <option>Allergy</option>
            <option>COPD</option>
            <option>Dust Allergy</option>
            <option>Seasonal Allergy</option>
            <option>Bronchitis</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Phone *</label>
          <input 
            className="field-input" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+92-300-0000000" 
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">City *</label>
          <input 
            className="field-input" 
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Gujranwala" 
            required
          />
        </div>
        <div className="field-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
          <label className="field-label">Assign Doctor (Optional)</label>
          <select 
            className="field-input field-select" 
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
          >
            <option value="">— No doctor yet —</option>
            {doctors.filter(d => d.status === 'active').map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.spec})
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default AddPatientModal;