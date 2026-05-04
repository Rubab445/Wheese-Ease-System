import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import AdminDashboard from './admin';
import SignUp from './Signup';
import './styles/Login.css';
import "./styles/Signup.css";
import Layout from './DoctorDashboard/Components/layout/Layout';
import Analytics from './DoctorDashboard/Pages/Analytics';
import PatientDirectory from './DoctorDashboard/Pages/PatientDirectory';
import PatientDetail from './DoctorDashboard/Pages/PatientDetail';
import AlertsHub from './DoctorDashboard/Pages/AlertsHub';
import Settings from './AdminDashboard/Pages/Settings';
import Prescriptions from './DoctorDashboard/Pages/Prescriptions';
import Messages from './DoctorDashboard/Pages/Messages';
import DoctorDashboard from './DoctorDashboard/Pages/Dashboard';

function App() {
    // Authentication aur Role ko localStorage se initial load karna
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
    );
    const [userRole, setUserRole] = useState<string | null>(
        localStorage.getItem('userRole')
    );

    // Login hone par state update karne ka function
    const handleLogin = (role: string) => {
        setIsAuthenticated(true);
        setUserRole(role);
    };

    return (
        <BrowserRouter>
            {/* FontAwesome for icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            
            <Routes>
                {/* Auth Routes: Agar login hai to dashboard bhejo, warna login dikhao */}
                <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                />
                
                <Route path="/signup" element={<SignUp />} />

                {/* Admin Protected Route */}
                <Route
                    path="/admin"
                    element={
                            <AdminDashboard />
                    }
                />
                 <Route
                    path="/analytics"
                    element={
                          <Layout><Analytics /></Layout>
                    }
                />
                <Route path="/patients" element={<Layout><PatientDirectory /></Layout>} />
                <Route path="/patients/:id" element={<Layout><PatientDetail /></Layout>} />
                <Route path="/alerts" element={<Layout><AlertsHub /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/prescriptions" element={<Layout><Prescriptions /></Layout>} />
                <Route path="/messages" element={<Layout><Messages /></Layout>} />
                {/* Doctor Dashboard Protected Route */}
                <Route
                    path="/doctor"
                    element={
                            <Layout>
                           <DoctorDashboard />
                          </Layout>
                    }
                />
                {/* Default Redirect: "/" par aane wala user status ke mutabiq redirect hoga */}
                <Route 
                    path="/" 
                    element={

                            <Navigate to="/login" replace />
                    } 
                />

                {/* Catch-all: Agar koi ghalat URL likhe to wapis home/login par bhejo */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;