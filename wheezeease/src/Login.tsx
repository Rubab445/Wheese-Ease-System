import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import './styles/Login.css';
import LoginImage from './assets/newImage.png';
import { supabase } from './lib/supabase';

interface LoginProps {
    onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', auth: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateEmail = (email: string) => {
        if (!email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { email: '', password: '', auth: '' };

        const emailError = validateEmail(username);
        if (emailError) { setErrors({ ...newErrors, email: emailError }); return; }
        if (!password) { setErrors({ ...newErrors, password: 'Password is required' }); return; }
        if (password.length < 6) { setErrors({ ...newErrors, password: 'Password must be at least 6 characters' }); return; }

        setIsLoading(true);

        // Admin: hardcoded
        if (username === 'admin@onco.com' && password === 'admin123') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', 'admin');
            setIsLoading(false);
            setShowSuccess(true);
            setTimeout(() => { setShowSuccess(false); onLogin('admin'); }, 2000);
            return;
        }

        // Doctor: Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password,
        });

        if (error || !data.user) {
            setIsLoading(false);
            setErrors({ ...newErrors, auth: error?.message ?? 'Invalid credentials. Please try again.' });
            return;
        }

        // Verify this user is registered as a doctor
        const { data: doctor } = await supabase
            .from('doctors')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();

        if (!doctor) {
            await supabase.auth.signOut();
            setIsLoading(false);
            setErrors({ ...newErrors, auth: 'Access denied. This account is not registered as a doctor.' });
            return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'doctor');
        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); onLogin('doctor'); }, 2000);
    };

    return (
        <div className="onco-app-viewport">
            <div className="onco-main-structure">
                {/* 1. Form Section */}
                <div className="onco-form-section">
                    <div className="onco-form-container">
                        <div className="onco-header-block">
                            <Stethoscope size={48} strokeWidth={1.5} color="#1f2933" />
                            <h1 className="onco-page-title">Login</h1>
                        </div>

                        {errors.auth && (
                            <div className="onco-auth-alert">
                                ⚠ {errors.auth}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="onco-interactive-form">
                            <div className={`onco-input-group ${errors.email ? 'onco-input-error' : ''}`}>
                                <div className="onco-icon-adornment">
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                                        <path d="M18 0H2C0.9 0 0.01 0.9 0.01 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 14H2V4L10 9L18 4V14ZM10 7L2 2H18L10 7Z" fill="#5F6368"/>
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Email Address" 
                                    value={username}
                                    className="onco-text-input"
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setErrors({ ...errors, email: '', auth: '' });
                                    }}
                                />
                            </div>
                            {errors.email && <div className="onco-error-text">{errors.email}</div>}

                            <div className={`onco-input-group ${errors.password ? 'onco-input-error' : ''}`}>
                                <div className="onco-icon-adornment">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.91 1.75C10.74 1.75 8.91 3.25 8.41 5.25H1V10.25H3.5V12.75H6V15.25H8.5V17.75H13.5V13.29C15.96 12.83 17.83 10.66 17.83 8.08C17.83 4.58 15.63 1.75 12.91 1.75ZM13.5 9C12.95 9 12.5 8.55 12.5 8C12.5 7.45 12.95 7 13.5 7C14.05 7 14.5 7.45 14.5 8C14.5 8.55 14.5 9 13.5 9Z" fill="#5F6368"/>
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    className="onco-text-input"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors({ ...errors, password: '', auth: '' });
                                    }}
                                />
                            </div>
                            {errors.password && <div className="onco-error-text">{errors.password}</div>}

                            <button type="submit" className="onco-submit-button" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Login'}
                            </button>
                        </form>

                        <div className="onco-navigation-row">
                            Don't have an account? <a href="/signup" className="onco-accent-link">Register</a>
                        </div>
                    </div>
                </div>

                {/* 2. Visual Section (Rounded Oval Container) */}
                <div className="onco-visual-section">
                    <div className="onco-visual-canvas">
                        <img 
                            src={LoginImage}
                            alt="Medical Staff Illustration" 
                            className="onco-main-illustration" 
                        />
                    </div>
                </div>
            </div>

            {showSuccess && (
                <div className="onco-success-overlay">
                    <div className="onco-success-card">
                        <div className="onco-success-icon">✓</div>
                        <div className="onco-success-msg">Success! Redirecting...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;