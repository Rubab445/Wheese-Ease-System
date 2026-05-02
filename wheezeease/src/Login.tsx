import React, { useState } from 'react';

interface LoginProps {
    onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    // UI States
    const [errors, setErrors] = useState({ email: false, password: false, auth: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateUsername = (username: string) => {
        return username.trim() !== '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let hasError = false;
        const newErrors = { email: false, password: false, auth: '' };
        
        if (!validateUsername(username)) {
            newErrors.email = true;
            hasError = true;
        }
        if (password.length < 6) {
            newErrors.password = true;
            hasError = true;
        }
        
        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        
        // Mock Backend Authentication
        setTimeout(() => {
            let role = '';
            if (username === 'doctor' && password === '12345678') {
                role = 'doctor';
            } else if (username === 'admin' && password === 'admin123') {
                role = 'admin';
            }

            if (role !== '') {
                setIsLoading(false);
                setShowSuccess(true);
                
                // Store authentication state
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', role);
                
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                }

                setTimeout(() => {
                    setShowSuccess(false);
                    onLogin(role);
                }, 2000);
            } else {
                setIsLoading(false);
                setErrors({ ...newErrors, auth: 'Invalid credentials. Please use doctor or admin' });
            }
        }, 1500);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', 'doctor');
            setTimeout(() => {
                setShowSuccess(false);
                onLogin('doctor');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                
                {/* LEFT SIDE */}
                <div className="login-left">
                    <div className="blob blob1"></div>
                    <div className="blob blob2"></div>
                    <div className="blob blob3"></div>
                    <div className="glow"></div>
                    <div className="left-content">
                        <div className="left-logo">
                            <div className="logo-icon">🫁</div>
                            <div>
                                <div className="logo-name">WheezeEase</div>
                                <div className="logo-tag">AI-Powered Respiratory Care</div>
                            </div>
                        </div>
                        <div className="left-hero">
                            <h2>Smart Care for Every<br/><em>Breath Taken</em></h2>
                            <p>Monitor asthma and allergy patients in real-time with AI-driven insights.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="login-right">
                    <div className="login-card">
                        <div className="title-block">
                            <div className="form-title">Sign In</div>
                            <div className="form-sub">Welcome back to <span>WheezeEase</span></div>
                        </div>

                        {errors.auth && (
                            <div className="auth-error-alert">
                                ⚠️ {errors.auth}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label className="field-label">User Name</label>
                                <div className="input-wrap">
                                    <span className="i-icon">✉️</span>
                                    <input 
                                        type="text" 
                                        className={errors.email ? 'err' : ''}
                                        placeholder="John Doe" 
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setErrors({ ...errors, email: false, auth: '' });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="field-label">Password</label>
                                <div className="input-wrap">
                                    <span className="i-icon">🔐</span>
                                    <input 
                                        type={passwordVisible ? 'text' : 'password'}
                                        className={errors.password ? 'err' : ''}
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrors({ ...errors, password: false, auth: '' });
                                        }}
                                    />
                                    <button 
                                        type="button" 
                                        className="pw-eye" 
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className="remember-row">
                                <label className="check-label">
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="check-text">Remember me</span>
                                </label>
                                <a href="#" className="row-forgot">Forgot password?</a>
                            </div>

                            <button type="submit" className={`submit-btn ${isLoading ? 'spin' : ''}`} disabled={isLoading}>
                                <span className="btn-txt">
                                    {isLoading ? 'Verifying...' : 'Sign In →'}
                                </span>
                                {isLoading && <div className="loader"></div>}
                            </button>
                        </form>

                        <div className="divider-row">
                            <div className="divider-line"></div>
                            <span className="divider-text">or continue with</span>
                            <div className="divider-line"></div>
                        </div>

                        <button className="google-btn" onClick={handleGoogleLogin} disabled={isLoading}>
                            Continue with Google
                        </button>

                        <div className="register-row">
                            Don't have an account? <a href="/signup">Register Here</a>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <div className="success-layer show">
                    <div className="s-circle">✓</div>
                    <div className="s-title">Login Successful!</div>
                    <div className="s-sub">Redirecting to Dashboard...</div>
                    <div className="s-bar"><div className="s-fill"></div></div>
                </div>
            )}
        </div>
    );
};

export default Login;