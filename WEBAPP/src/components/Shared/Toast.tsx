import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onHide }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Toast;