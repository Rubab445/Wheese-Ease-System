import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Lock, Eye, EyeOff, ShieldCheck, 
  ChevronDown, CheckCircle2, ArrowRight 
} from "lucide-react"; 
import './styles/Signup.css';

type Role = "patient" | "admin" | "";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "" as Role
  });
  
  const [errors, setErrors] = useState<any>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: any = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.role) newErrors.role = "Please select a role";
    if (form.password.length < 8) newErrors.password = "Password must be 8+ chars";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className={`signup-container ${mounted ? "fade-in" : ""}`}>
      {/* LEFT SIDE: FORM PANEL */}
      <div className="signup-left-panel">
        <div className="form-wrapper">
          <div className="brand-logo" onClick={() => navigate("/")}>
            <div className="logo-sq">W</div>
            <span>WheezeEase</span>
          </div>

          {submitted ? (
            <div className="success-state">
              <CheckCircle2 size={60} color="#2d8f5a" />
              <h2>Verify your email</h2>
              <p>We've sent an activation link to <strong>{form.email}</strong>.</p>
              <button className="main-btn" onClick={() => navigate("/login")}>Go to Login</button>
            </div>
          ) : (
            <div className="form-content">
              <div className="header-text">
                <h1>Create Account</h1>
                <p>Join the AI-powered respiratory care platform.</p>
              </div>

              <form onSubmit={handleSubmit} className="modern-form">
                {/* Full Name */}
                <div className="input-group">
                  <label>User Name</label>
                  <div className={`input-box ${errors.name ? "input-error" : ""}`}>
                    <User className="icon" size={18} />
                    <input 
                      type="text" placeholder="Ahmad Ali" 
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  {errors.name && <span className="err-txt">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="input-group">
                  <label>Email Address</label>
                  <div className={`input-box ${errors.email ? "input-error" : ""}`}>
                    <Mail className="icon" size={18} />
                    <input 
                      type="email" placeholder="name@example.com" 
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  {errors.email && <span className="err-txt">{errors.email}</span>}
                </div>

                {/* Role Dropdown */}
                <div className="input-group">
                  <label>Join as</label>
                  <div className={`input-box select-box ${errors.role ? "input-error" : ""}`}>
                    <ShieldCheck className="icon" size={18} />
                    <select 
                      value={form.role} 
                      onChange={(e) => handleChange("role", e.target.value)}
                    >
                      <option value="" disabled>Select your role</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <ChevronDown className="select-arrow" size={16} />
                  </div>
                  {errors.role && <span className="err-txt">{errors.role}</span>}
                </div>

                {/* Password */}
                <div className="input-group">
                  <label>Password</label>
                  <div className={`input-box ${errors.password ? "input-error" : ""}`}>
                    <Lock className="icon" size={18} />
                    <input 
                      type={showPass ? "text" : "password"} 
                      placeholder="Min. 8 characters" 
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <div className="eye-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="input-group">
                  <label>Confirm Password</label>
                  <div className={`input-box ${errors.confirmPassword ? "input-error" : ""}`}>
                    <ShieldCheck className="icon" size={18} />
                    <input 
                      type={showConfirmPass ? "text" : "password"} 
                      placeholder="Re-enter password" 
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    />
                    <div className="eye-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                  {errors.confirmPassword && <span className="err-txt">{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className="main-btn">
                  Create Account <ArrowRight size={18} style={{marginLeft: '8px'}} />
                </button>
              </form>

              <p className="footer-link">
                Already have an account? <span onClick={() => navigate("/")}>Sign in</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: HERO PANEL (Filled Color) */}
      <div className="signup-right-panel">
        <div className="hero-content">
          <div className="hero-info">
            <span className="pill">WheezeEase AI</span>
            <h1 style={{fontSize:'46px', marginTop:'20px'}}>Intelligent care for every breath.</h1>
            <p>Experience the future of respiratory health with real-time AI insights and environmental monitoring.</p>
            
            <div className="feature-list">
              <div className="f-item">
                <CheckCircle2 size={20} className="f-icon" />
                <span>98% Prediction Accuracy</span>
              </div>
              <div className="f-item">
                <CheckCircle2 size={20} className="f-icon" />
                <span>Real-time Air Quality Data</span>
              </div>
              <div className="f-item">
                <CheckCircle2 size={20} className="f-icon" />
                <span>Secure Patient-Admin Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;