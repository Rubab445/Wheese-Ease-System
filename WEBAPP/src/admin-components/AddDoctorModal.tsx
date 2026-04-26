// src/components/AddDoctorModal.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import type { NewDoctorData } from '../types';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoctor: (doctor: NewDoctorData) => void;
  onShowToast: (msg: string) => void;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onAddDoctor, onShowToast }) => {
  const [formData, setFormData] = useState<NewDoctorData>({
    name: '',
    specialty: 'Pulmonologist',
    email: '',
    phone: '',
    hospital: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.hospital) {
      onShowToast('⚠️ Please fill all required fields');
      return;
    }
    onAddDoctor(formData);
    setFormData({
      name: '',
      specialty: 'Pulmonologist',
      email: '',
      phone: '',
      hospital: '',
      notes: ''
    });
    onClose();
    onShowToast('✅ Doctor added and invitation sent');
  };

  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleSubmit}>Add Doctor</button>
    </>
  );

  return (
    <Modal id="addDoctorModal" title="➕ Add New Doctor" size="md" isOpen={isOpen} onClose={onClose} footer={footer}>
      <div className="grid2">
        <div className="field-group">
          <label className="field-label">Full Name *</label>
          <input 
            className="field-input" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dr. Full Name" 
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">Specialty *</label>
          <select 
            className="field-input field-select" 
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
          >
            <option>Pulmonologist</option>
            <option>Allergist</option>
            <option>General Physician</option>
            <option>Pediatric Pulmonologist</option>
            <option>Respiratory Therapist</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Email *</label>
          <input 
            className="field-input" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@hospital.com" 
            type="email"
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">Phone</label>
          <input 
            className="field-input" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+92-300-0000000" 
          />
        </div>
        <div className="field-group" style={{ gridColumn: 'span 2' }}>
          <label className="field-label">Hospital / Clinic *</label>
          <input 
            className="field-input" 
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="Hospital name" 
            required
          />
        </div>
        <div className="field-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
          <label className="field-label">Notes (optional)</label>
          <textarea 
            className="field-input" 
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2} 
            style={{ resize: 'none' }} 
            placeholder="Any relevant notes…"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddDoctorModal;