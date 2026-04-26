// src/components/ConfirmPatientModal.tsx
import React from 'react';
import Modal from './Modal';

interface ConfirmPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  action: 'suspend' | 'remove';
  onShowToast: (msg: string) => void;
}

const ConfirmPatientModal: React.FC<ConfirmPatientModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  action,
  onShowToast
}) => {
  const getContent = () => {
    if (action === 'suspend') {
      return {
        title: 'Suspend Patient',
        message: `Are you sure you want to suspend ${patientName}?`,
        subMessage: 'The patient will no longer be able to access the platform until reactivated.',
        confirmText: 'Suspend',
        icon: '🔴'
      };
    }
    return {
      title: 'Remove Patient',
      message: `Are you sure you want to remove ${patientName}?`,
      subMessage: 'This action cannot be undone. All patient data will be permanently deleted.',
      confirmText: 'Remove',
      icon: '⚠️'
    };
  };

  const content = getContent();

  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-red" onClick={onConfirm}>
        {content.confirmText}
      </button>
    </>
  );

  return (
    <Modal id="confirmPatientModal" title={content.title} size="sm" isOpen={isOpen} onClose={onClose} footer={footer}>
      <div style={{ textAlign: 'center' }}>
        <div className="confirm-icon">{content.icon}</div>
        <div className="confirm-msg">{content.message}</div>
        <div className="confirm-sub">{content.subMessage}</div>
      </div>
    </Modal>
  );
};

export default ConfirmPatientModal;