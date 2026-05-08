import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import PatientsPage from './DoctorDashboard/Pages/PatientDirectory'

function App() {
    // Handle login - you can implement your actual login logic here
    const handleLogin = () => {
        // Your login logic here
        console.log("User logged in");
    };

    return (
        <BrowserRouter>
            {/* FontAwesome for icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

            <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Admin Route */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Doctor Dashboard Routes with Layout */}
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/messages" element={<Layout><Messages /></Layout>} />
                <Route path="/patients" element={<Layout><PatientDirectory /></Layout>} />
                <Route path="/dashboard" element={<Layout><DashboardOverview /></Layout>} />
                
                {/* New Enhanced Patients Page - Replace the old PatientDirectory if needed */}
                <Route path="/enhanced-patients" element={<Layout><PatientsPage /></Layout>} />
                
                {/* Doctor Dashboard default */}
                <Route path="/doctor" element={<Layout><DashboardOverview /></Layout>} />
                <Route path="/alerts" element={<Layout><AlertsHub /></Layout>} />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;