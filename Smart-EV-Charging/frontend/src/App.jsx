import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// User Portal Pages
import Dashboard from './pages/Dashboard';
import Stations from './pages/Stations';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import ChargingSession from './pages/ChargingSession';
import EnergyConsumption from './pages/EnergyConsumption';
import Payment from './pages/Payment';
import Vehicles from './pages/Vehicles';
import Profile from './pages/Profile';
import FleetMap from './pages/FleetMap';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Suite Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminStations from './pages/admin/AdminStations';
import AdminPorts from './pages/admin/AdminPorts';
import AdminBookings from './pages/admin/AdminBookings';
import AdminSessions from './pages/admin/AdminSessions';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';

// User Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Protected Route wrapper
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Verifying admin permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// User Layout with Top Navbar + Sidebar
const AppLayout = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-viewport">
        <Navbar />
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/fleet-map" element={<FleetMap />} />
            <Route path="/map" element={<FleetMap />} />
            <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/charging-session" element={<ProtectedRoute><ChargingSession /></ProtectedRoute>} />
            <Route path="/energy-consumption" element={<ProtectedRoute><EnergyConsumption /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dedicated Admin Control Suite */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/vehicles" element={<AdminVehicles />} />
                    <Route path="/stations" element={<AdminStations />} />
                    <Route path="/map" element={<FleetMap />} />
                    <Route path="/fleet-map" element={<FleetMap />} />
                    <Route path="/ports" element={<AdminPorts />} />
                    <Route path="/bookings" element={<AdminBookings />} />
                    <Route path="/sessions" element={<AdminSessions />} />
                    <Route path="/payments" element={<AdminPayments />} />
                    <Route path="/energy-reports" element={<AdminReports />} />
                    <Route path="/revenue-reports" element={<AdminReports />} />
                    <Route path="/reports" element={<AdminReports />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* User Application */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
