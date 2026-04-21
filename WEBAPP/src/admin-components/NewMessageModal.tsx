// src/components/NewMessageModal.tsx
import React, { useState } from 'react';
import type { Doctor } from '../types';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  onSendMessage: (doctorId: string, message: string) => void;
  onShowToast: (msg: string) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  doctors,
  onSendMessage,
  onShowToast
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!selectedDoctorId) {
      onShowToast('⚠️ Please select a doctor');
      return;
    }
    if (!message.trim()) {
      onShowToast('⚠️ Please enter a message');
      return;
    }
    onSendMessage(selectedDoctorId, message);
    setSelectedDoctorId('');
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">New Message</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field-group">
            <label className="field-label">TO</label>
            <select 
              className="field-input field-select"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">Select a doctor...</option>
              {doctors.filter(d => d.status === 'active').map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.spec}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">MESSAGE</label>
            <textarea 
              className="field-input"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSend}>Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;