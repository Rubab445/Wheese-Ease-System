// src/components/MobileMenuButton.tsx
import React, { useEffect, useState } from 'react';

interface MobileMenuButtonProps {
  onToggle: () => void;
  isOpen: boolean;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onToggle, isOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null;

  return (
    <button 
      className="mobile-menu-btn" 
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      {isOpen ? '✕' : '☰'}
    </button>
  );
};

export default MobileMenuButton;