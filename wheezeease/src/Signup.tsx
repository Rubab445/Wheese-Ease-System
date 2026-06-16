import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Stethoscope, ShieldCheck, BrainCircuit, Bell } from "lucide-react";
import "./styles/Signup.css";
import { supabase } from "./lib/supabase";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setIsLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    // Save name so AuthCallback can insert the doctors row after email confirmation
    localStorage.setItem('pendingDoctorName', fullName.trim());

    // If session exists immediately (email confirmation disabled), insert now
    if (data.user && data.session) {
      await supabase.from('doctors').insert({
        id: data.user.id,
        full_name: fullName.trim(),
        specialty: 'Pulmonology',
      });
      await supabase.from('users').insert({
        id: data.user.id,
        full_name: fullName.trim(),
        email: email,
        role: 'doctor',
      });
      localStorage.removeItem('pendingDoctorName');
      setTimeout(() => navigate('/login'), 2500);
    }

    setIsLoading(false);
    setSuccess(true);
  };

  return (
    <div className="sp-wrapper">

      {/* ── Left panel ── */}
      <div className="sp-left">
        <div className="sp-left-bg-circle sp-circle-1" />
        <div className="sp-left-bg-circle sp-circle-2" />
        <div className="sp-left-bg-circle sp-circle-3" />

        <div className="sp-left-inner">
          <div className="sp-logo">
            <div className="sp-logo-icon"><Stethoscope size={22} strokeWidth={1.8} color="white" /></div>
            <span>WheezeEase</span>
          </div>

          <div className="sp-hero">
            <h1>Clinical AI for<br />Respiratory Care</h1>
            <p>Monitor your patients in real time with AI-powered risk predictions and smart alerts — built for modern clinicians.</p>
          </div>

          <div className="sp-features">
            <div className="sp-feature">
              <div className="sp-feature-icon"><ShieldCheck size={16} /></div>
              <span>HIPAA-compliant patient monitoring</span>
            </div>
            <div className="sp-feature">
              <div className="sp-feature-icon"><BrainCircuit size={16} /></div>
              <span>AI-powered asthma risk predictions</span>
            </div>
            <div className="sp-feature">
              <div className="sp-feature-icon"><Bell size={16} /></div>
              <span>Real-time critical alerts & escalation</span>
            </div>
          </div>

          <div className="sp-trust">
            <div className="sp-trust-avatars">
              {['DR', 'SA', 'MK', 'FN'].map((av, i) => (
                <div key={i} className="sp-trust-av" style={{ zIndex: 4 - i }}>{av}</div>
              ))}
            </div>
            <span>Trusted by 200+ clinicians</span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="sp-right">
        <div className="sp-form-box">

          {success ? (
            <div className="sp-success">
              <div className="sp-success-icon">✓</div>
              <h3>Account created!</h3>
              <p>Check your email <strong>({email})</strong> and click the confirmation link, then come back to sign in.</p>
            </div>
          ) : (
            <>
              <div className="sp-form-header">
                <h2>Create your account</h2>
                <p>Register as a doctor to access the clinical dashboard</p>
              </div>

              <button className="sp-google-btn" onClick={handleGoogleSignUp} type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="sp-divider"><span>or register with email</span></div>

              {error && <div className="sp-error-box">{error}</div>}

              <form onSubmit={handleSignUp} className="sp-form">
                <div className="sp-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Dr. Ahmad Ali"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-field">
                  <label>Password</label>
                  <div className="sp-pass-wrap">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="sp-eye-btn" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="sp-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <><span className="sp-spinner" /> Creating account...</>
                  ) : 'Create Doctor Account'}
                </button>
              </form>

              <p className="sp-login-link">
                Already have an account?{' '}
                <span onClick={() => navigate('/login')}>Sign in</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
