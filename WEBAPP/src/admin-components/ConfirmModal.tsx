// src/components/ConfirmModal.tsx
import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  subMessage,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = '⚠️',
  isDanger = true
}) => {
  const footer = (
    <>
      <button className="btn btn-ghost" onClick={onClose}>{cancelText}</button>
      <button className={`btn ${isDanger ? 'btn-red' : 'btn-primary'}`} onClick={onConfirm}>
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal id="confirmModal" title={title} size="sm" isOpen={isOpen} onClose={onClose} footer={footer}>
      <div style={{ textAlign: 'center' }}>
        <div className="confirm-icon">{icon}</div>
        <div className="confirm-msg">{message}</div>
        {subMessage && <div className="confirm-sub">{subMessage}</div>}
      </div>
    </Modal>
  );
};

export default ConfirmModal;