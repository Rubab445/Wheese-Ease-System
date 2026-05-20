import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminDashboard from './admin';
import SignUp from './Signup';
import './styles/Login.css';
import "./styles/Signup.css";
import Layout from './DoctorDashboard/Components/layout/Layout';
import PatientDirectory from './DoctorDashboard/Pages/PatientDirectory';
import DashboardOverview from './DoctorDashboard/Pages/DashboardOverview';
import Analytics from './DoctorDashboard/Pages/Analytics';
import Settings from './DoctorDashboard/Pages/Settings';
import Messages from './DoctorDashboard/Pages/Messages';
import { LandingPage } from './LandingPage/LandingPage';
import AlertsHub from './DoctorDashboard/Pages/AlertsPage';
import Login from './Login';
import AuthCallback from './AuthCallback';

function LoginWrapper() {
    const navigate = useNavigate();
    const handleLogin = (role: string) => {
        if (role === 'admin') navigate('/admin');
        else navigate('/dashboard');
    };
    return <Login onLogin={handleLogin} />;
}

function App() {
    return (
        <BrowserRouter>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginWrapper />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/messages" element={<Layout><Messages /></Layout>} />
                <Route path="/patients" element={<Layout><PatientDirectory /></Layout>} />
                <Route path="/dashboard" element={<Layout><DashboardOverview /></Layout>} />
                <Route path="/doctor" element={<Layout><DashboardOverview /></Layout>} />
                <Route path="/alerts" element={<Layout><AlertsHub /></Layout>} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;