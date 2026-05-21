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
import ProtectedRoute from './components/ProtectedRoute';

function LoginWrapper() {
    const navigate = useNavigate();

    // If already authenticated, redirect to the correct dashboard
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');
    if (isAuth && role === 'admin') return <Navigate to="/admin" replace />;
    if (isAuth && role === 'doctor') return <Navigate to="/dashboard" replace />;

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
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginWrapper />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Admin-only routes */}
                <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* Doctor-only routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute requiredRole="doctor">
                        <Layout><DashboardOverview /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/doctor" element={
                    <ProtectedRoute requiredRole="doctor">
                        <Layout><DashboardOverview /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/patients" element={
                    <ProtectedRoute requiredRole="doctor">
                        <Layout><PatientDirectory /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute requiredRole="doctor">
                        <Layout><Analytics /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/alerts" element={
                    <ProtectedRoute requiredRole="doctor">
                        <Layout><AlertsHub /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/messages" element={
                    <ProtectedRoute requiredRole="doctor">
                        <Layout><Messages /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute requiredRole="doctor">
                        <Layout><Settings /></Layout>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
