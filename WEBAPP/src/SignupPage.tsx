// src/pages/SignupPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../src/styles/signup.css"

/* ── Lungs Logo Icon ─────────────────────────────────────────────────────── */
const LungsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="url(#logoGradient)" />
    <path d="M24 14 L24 34 M14 24 L34 24" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2.5" fill="none" />
    <path d="M18 18 L30 30 M30 18 L18 30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
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

/* ── Signup Page Component ───────────────────────────────────────────────── */
const SignupPage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
    // Step 2 - Professional Info
    specialty: '',
    hospital: '',
    licenseNumber: '',
    experience: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    hospital: '',
    licenseNumber: '',
    agreeTerms: '',
    general: ''
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, isError: boolean = false) => {
    setToast(msg);
    setToastShow(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 3200);
  };

  // Cities and States
  const states = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
    'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Kashmir'
  ];

  const citiesByState: Record<string, string[]> = {
    'Punjab': ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan'],
    'Balochistan': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar'],
    'Islamabad Capital Territory': ['Islamabad'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Bagh']
  };

  const getCities = () => {
    return citiesByState[formData.state] || [];
  };

  // Validate Step 1
  const validateStep1 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else {
      newErrors.firstName = '';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else {
      newErrors.lastName = '';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[\+]?[0-9]{10,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid phone number';
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    if (!formData.state) {
      newErrors.state = 'Please select your state';
      isValid = false;
    } else {
      newErrors.state = '';
    }

    if (!formData.city) {
      newErrors.city = 'Please select your city';
      isValid = false;
    } else {
      newErrors.city = '';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validate Step 2
  const validateStep2 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.specialty) {
      newErrors.specialty = 'Please select your specialty';
      isValid = false;
    } else {
      newErrors.specialty = '';
    }

    if (!formData.hospital) {
      newErrors.hospital = 'Hospital/Clinic name is required';
      isValid = false;
    } else {
      newErrors.hospital = '';
    }

    if (!formData.licenseNumber) {
      newErrors.licenseNumber = 'Medical license number is required';
      isValid = false;
    } else {
      newErrors.licenseNumber = '';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
      isValid = false;
    } else {
      newErrors.agreeTerms = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset city when state changes
      ...(name === 'state' ? { city: '' } : {})
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors(prev => ({ ...prev, general: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      const emailExists = existingUsers.some((u: any) => u.email === formData.email);

      if (emailExists) {
        setErrors(prev => ({ ...prev, general: 'Email already registered. Please login.' }));
        showToast('Email already registered', true);
        setIsLoading(false);
        return;
      }

      const registrationData = {
        id: `REG-${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        role: 'doctor',
        status: 'pending',
        specialty: formData.specialty,
        hospital: formData.hospital,
        licenseNumber: formData.licenseNumber,
        experience: formData.experience,
        registeredAt: new Date().toISOString()
      };

      existingUsers.push(registrationData);
      localStorage.setItem('pendingUsers', JSON.stringify(existingUsers));

      showToast('Registration submitted! Pending admin approval.');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
      setIsLoading(false);
    }, 1000);
  };

  const specialties = [
    'Pulmonology',
    'Allergy & Immunology',
    'Respiratory Medicine',
    'Pediatric Pulmonology',
    'Critical Care Medicine',
    'Sleep Medicine',
    'Interventional Pulmonology'
  ];

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      {/* Background with bubbles and ECG */}
      <div className="signup-bg">
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

      {/* Signup Card */}
      <div className="signup-page">
        <div className="signup-card">
          <div className="logo-wrap">
            <LungsIcon />
          </div>

          <h1 className="signup-title">Create <span className="title-highlight">Account</span></h1>
          <p className="signup-subtitle">Join WheezeEase as a Doctor</p>

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-circle">1</div>
              <span>Personal Info</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span>Professional Info</span>
            </div>
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}>
            {step === 1 && (
              <>
                {/* Row 1: First Name & Last Name */}
                <div className="form-row-2">
                  <div className={`form-group half ${errors.firstName ? 'error' : ''}`}>
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className={`form-group half ${errors.lastName ? 'error' : ''}`}>
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-input"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="form-row-2">
                  <div className={`form-group half ${errors.email ? 'error' : ''}`}>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="doctor@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className={`form-group half ${errors.phone ? 'error' : ''}`}>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="+92-300-1234567"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                {/* Row 3: State & City */}
                <div className="form-row-2">
                  <div className={`form-group half ${errors.state ? 'error' : ''}`}>
                    <label className="form-label">State / Province *</label>
                    <select name="state" className="form-input" value={formData.state} onChange={handleChange}>
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                  <div className={`form-group half ${errors.city ? 'error' : ''}`}>
                    <label className="form-label">City *</label>
                    <select name="city" className="form-input" value={formData.city} onChange={handleChange} disabled={!formData.state}>
                      <option value="">Select city</option>
                      {getCities().map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                </div>

                {/* Row 4: Password */}
                <div className={`form-group ${errors.password ? 'error' : ''}`}>
                  <label className="form-label">Password *</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-input"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                {/* Row 5: Confirm Password */}
                <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                  <label className="form-label">Confirm Password *</label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className={`form-group ${errors.specialty ? 'error' : ''}`}>
                  <label className="form-label">Specialty *</label>
                  <select name="specialty" className="form-input" value={formData.specialty} onChange={handleChange}>
                    <option value="">Select your specialty</option>
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {errors.specialty && <span className="error-text">{errors.specialty}</span>}
                </div>

                <div className={`form-group ${errors.hospital ? 'error' : ''}`}>
                  <label className="form-label">Hospital / Clinic *</label>
                  <input
                    type="text"
                    name="hospital"
                    className="form-input"
                    placeholder="e.g., Gujranwala General Hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                  />
                  {errors.hospital && <span className="error-text">{errors.hospital}</span>}
                </div>

                <div className={`form-group ${errors.licenseNumber ? 'error' : ''}`}>
                  <label className="form-label">Medical License Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    className="form-input"
                    placeholder="e.g., PMC-PUL-12345"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                  {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <select name="experience" className="form-input" value={formData.experience} onChange={handleChange}>
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div className={`form-group terms ${errors.agreeTerms ? 'error' : ''}`}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                    />
                    <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                  </label>
                  {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
                </div>
              </>
            )}

            {errors.general && (
              <div className="general-error">
                <span>⚠️</span> {errors.general}
              </div>
            )}

            <div className="form-buttons">
              {step === 2 && (
                <button type="button" className="btn-back" onClick={handleBack}>
                  ← Back
                </button>
              )}
              {step === 1 ? (
                <button type="button" className="btn-next" onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <button type="submit" className="btn-signup" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Sign Up'}
                </button>
              )}
            </div>
          </form>

          <div className="signup-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`custom-toast ${toastShow ? 'show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">{toast.includes('submitted') ? '📋' : '⚠️'}</span>
          <span>{toast}</span>
        </div>
      </div>
    </>
  );
};

export default SignupPage;