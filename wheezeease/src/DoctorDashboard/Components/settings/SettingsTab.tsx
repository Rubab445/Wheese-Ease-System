import React from 'react';

interface SettingsTabProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <button 
      className={`nav-link ${isActive ? 'active' : ''}`} 
      onClick={onClick}
    >
      <i className={icon}></i>
      <span>{label}</span>
    </button>
  );
};

export default SettingsTab;