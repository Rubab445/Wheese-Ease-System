import React from 'react';
import './LandingPage.css';
import landingImage from '../assets/pms-landing-image.png';
import logoImg from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="logo-wrapper">
          <img 
            src={logoImg} 
            alt="WheezeEase Logo" 
            style={{ 
              height: '100px', 
              objectFit: 'contain', 
              mixBlendMode: 'multiply' 
            }} 
          />
        </div>
        <div className="nav-links-landing">
          <button className="text-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="register-btn" onClick={() => navigate("/signup")}>
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="content-left">
          <h1 className="title">
            <span className="text-green">Wheeze</span>Ease
          </h1>
          <div className="hospital-details">
            <p className="unit-name">AI-Powered Allergy & Asthma Assistant</p>
            <p className="tagline">Breathe easier with intelligent, real-time tracking and personalized insights for your respiratory health.</p>
          </div>
        </div>

        <div className="content-right">
          <img
            src={landingImage}
            alt="AI Healthcare Illustration"
            className="hero-illustration"
          />
        </div>
      </main>
    </div>
  );
};
