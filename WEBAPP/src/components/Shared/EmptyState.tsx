import React from 'react';

interface EmptyStateProps {
  icon: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => (
  <div className="empty-state">
    <div className="es-icon">{icon}</div>
    <p>{message}</p>
  </div>
);

export default EmptyState;