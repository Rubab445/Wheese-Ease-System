// src/pages/LoginPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveToken } from '../services/authService';
import '../styles/login.css';

/* ── SVG Icons ─────────────────────────────────────────────────────────────── */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    <path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" fill="url(#logoGradient)" />
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a8eff" />
        <stop offset="100%" stopColor="#6a5af9" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Bubble icons ──────────────────────────────────────────────────────────── */
const BubbleChemIcon = () => (
  <svg viewBox="0 0 40 40" width="56" height="56" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
    <circle cx="20" cy="9" r="4" />
    <line x1="20" y1="13" x2="20" y2="26" />
    <line x1="14" y1="19" x2="26" y2="19" />
    <ellipse cx="20" cy="29" rx="8" ry="5" />
    <path d="M16 27 Q14 31 16 35 Q20 37 24 35 Q26 31 24 27" />
  </svg>
);

const BubbleCubeIcon = () => (
  <svg viewBox="0 0 36 36" width="46" height="46" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
    <path d="M18 6L30 12V24L18 30L6 24V12Z" />
    <circle cx="18" cy="18" r="5" />
    <line x1="18" y1="6" x2="18" y2="13" />
    <line x1="18" y1="23" x2="18" y2="30" />
    <line x1="6" y1="12" x2="13" y2="15.5" />
    <line x1="23" y1="20.5" x2="30" y2="24" />
  </svg>
);

const BubbleClipboardIcon = () => (
  <svg viewBox="0 0 50 50" width="62" height="62" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5">
    <rect x="14" y="10" width="22" height="28" rx="4" />
    <line x1="20" y1="18" x2="30" y2="18" />
    <line x1="20" y1="23" x2="30" y2="23" />
    <line x1="20" y1="28" x2="26" y2="28" />
    <path d="M18 8L18 4L32 4L32 8" />
  </svg>
);

const BubbleStethoscopeIcon = () => (
  <svg viewBox="0 0 50 50" width="62" height="62" fill="none" stroke="rgba(255,255,255,0.68)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 12v10a7 7 0 0 0 14 0V12" />
    <path d="M15 12h6" />
    <path d="M29 12h6" />
    <path d="M25 29v4a7 7 0 0 0 7 7h2" />
    <circle cx="38" cy="40" r="4" />
  </svg>
);

const BubblePillsIcon = () => (
  <svg viewBox="0 0 50 50" width="58" height="58" fill="none" stroke="rgba(255,255,255,0.68)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="12" width="30" height="10" rx="5" />
    <line x1="25" y1="12" x2="25" y2="22" />
    <rect x="12" y="28" width="26" height="10" rx="5" />
    <line x1="15" y1="33" x2="35" y2="33" />
  </svg>
);

/* ── ECG path ──────────────────────────────────────────────────────────────── */
const ECG_D =
  'M0,32 L80,32 L100,32 L110,12 L122,52 L136,4 L148,60 L158,32 ' +
  'L180,32 L280,32 L300,32 L310,12 L322,52 L336,4 L348,60 L358,32 ' +
  'L380,32 L480,32 L500,32 L510,12 L522,52 L536,4 L548,60 L558,32 ' +
  'L580,32 L680,32 L700,32 L710,12 L722,52 L736,4 L748,60 L758,32 ' +
  'L780,32 L880,32 L900,32 L910,12 L922,52 L936,4 L948,60 L958,32 ' +
  'L980,32 L1080,32 L1100,32 L1110,12 L1122,52 L1136,4 L1148,60 L1158,32 L1200,32';

/* ── Login Page Component ─────────────────────────────────────────────────── */
const LoginPage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, isError: boolean = false) => {
    setToast(msg);
    setToastShow(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 3200);
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    setTimeout(() => {
      // Demo credentials
      if (formData.email === 'admin@wheezeease.com' && formData.password === 'admin123') {
        const token = 'admin-token-' + Date.now();
        saveToken(token);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('doctorName', 'Admin User');
        if (rememberMe) localStorage.setItem('rememberMe', 'true');
        showToast('Welcome back, Admin!');
        setTimeout(() => navigate('/admin-dashboard'), 1000);
      } 
      else if (formData.email === 'doctor@wheezeease.com' && formData.password === 'doctor123') {
        const token = 'doctor-token-' + Date.now();
        saveToken(token);
        localStorage.setItem('userRole', 'doctor');
        localStorage.setItem('doctorName', 'Dr. A. Rahman');
        if (rememberMe) localStorage.setItem('rememberMe', 'true');
        showToast('Welcome back, Doctor!');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
      else {
        setErrors(prev => ({ ...prev, general: 'Invalid email or password' }));
        showToast('Invalid credentials', true);
        setIsLoading(false);
      }
    }, 800);
  };

  const handleGoogleLogin = () => {
    showToast('Google login coming soon!', false);
  };

  useEffect(() => {
    // Check for remembered user
    const remembered = localStorage.getItem('rememberMe');
    if (remembered === 'true') {
      // Auto-fill logic can be added here
    }
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      {/* Background with bubbles and ECG */}
      <div className="login-bg">
        <div className="bubble bubble-1"><BubbleChemIcon /></div>
        <div className="bubble bubble-2"><BubbleCubeIcon /></div>
        <div className="bubble bubble-3"><BubbleStethoscopeIcon /></div>
        <div className="bubble bubble-4"><BubbleStethoscopeIcon /></div>
        <div className="bubble bubble-5"><BubbleClipboardIcon /></div>
        <div className="bubble bubble-6"><BubblePillsIcon /></div>
        <div className="bubble bubble-7"><BubblePillsIcon /></div>

        <div className="ecg-line-wrap">
          <svg viewBox="0 0 1200 64" preserveAspectRatio="none">
            <path className="ecg-path" d={ECG_D} />
          </svg>
        </div>
      </div>

      {/* Login Card */}
      <div className="login-page">
        <div className="login-card">
          <div className="logo-wrap">
            <PlusIcon />
          </div>

          <h1 className="login-main-title">Wheeze<span className="title-highlight">Ease</span></h1>
          <p className="login-subtitle">Welcome back! Please login to your account</p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className={`form-group ${errors.email ? 'error' : ''}`}>
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className={`form-group ${errors.password ? 'error' : ''}`}>
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="general-error">
                <span>⚠️</span> {errors.general}
              </div>
            )}

            {/* Login Button */}
            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            {/* Divider */}
            <div className="divider">
            </div>

            {/* Google Login Button */}
            <button 
              type="button" 
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <span className="google-icon">G</span>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <div className="signup-section">
              <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`custom-toast ${toastShow ? 'show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">{toast.includes('Welcome') ? '🎉' : '⚠️'}</span>
          <span>{toast}</span>
        </div>
      </div>
    </>
  );
};

export default LoginPage;