import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  LayoutGrid,
  ChevronDown
} from "lucide-react"; 
import './styles/Signup.css';
import image from './assets/stethoscope.png';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="signup-page">
      {/* LEFT SIDEBAR: AESTHETIC PANEL */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="app-icon-box">
            <LayoutGrid size={22} color="#5c6bc0" fill="#5c6bc0" fillOpacity={0.2} />
          </div>
        </div>
        
        <div className="sidebar-body">
          <h2 className="sidebar-headline">
            We at MediCare are <br/> always fully focused on <br/> helping your child.
          </h2>
          
          <div className="graphic-stage">
               {/* 3D Stethoscope Image or Illustration should go here */}
               <div className="stethoscope-placeholder">
                <img src={image} alt="Stethoscope"/>
               </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM PORTAL */}
      <div className="form-portal">
        <div className="top-nav">
          <span className="lang-text">English(US) <ChevronDown size={14} style={{marginLeft: '4px'}} /></span>
        </div>

        <div className="form-scroll-container">
          <div className="form-wrapper">
            <h1 className="main-title">Create Account</h1>

            <div className="social-actions">
              <button className="social-pill">
                {/* Colorful Google Icon using custom SVG for brand accuracy */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign up with Google</span>
              </button>
              
              <button className="social-pill">
                {/* Official Blue Facebook Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Sign up with Facebook</span>
              </button>
            </div>

            <div className="text-divider">-OR-</div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="underline-input">
                <input type="text" name="name" placeholder="Full Name:" required />
              </div>

              <div className="underline-input">
                <input type="email" name="email" placeholder="Email:" required />
              </div>

              <div className="underline-input">
                <input 
                  type={showPass ? "text" : "password"} 
                  name="password" 
                  placeholder="Password:" 
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-visibility" 
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" className="submit-action-btn">
                Create Account
              </button>
            </form>

            <p className="redirect-text">
              Already have an Account? <span onClick={() => navigate("/login")}>Log in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;