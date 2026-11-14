import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  PlugZap,
  CalendarCheck,
  Zap,
  Compass,
  CreditCard,
  Activity,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Search,
  Sun,
  Moon,
  ArrowLeft
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Exact navigation items specified by user:
  // - Dashboard
  // - Users
  // - Vehicles
  // - Charging Stations
  // - Charging Ports
  // - Bookings
  // - Charging Sessions
  // - Payments
  // - Energy Reports
  // - Revenue Reports
  // - Logout
  const adminNavItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { to: '/admin/stations', label: 'Charging Stations', icon: MapPin },
    { to: '/admin/map', label: 'Live Station Map', icon: Compass },
    { to: '/admin/ports', label: 'Charging Ports', icon: PlugZap },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/sessions', label: 'Charging Sessions', icon: Zap },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/energy-reports', label: 'Energy Reports', icon: Activity },
    { to: '/admin/revenue-reports', label: 'Revenue Reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell admin-shell">
      {/* Admin Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-logo">
          <div className="logo-icon-wrap" style={{ background: 'var(--primary-green-dark)', borderColor: 'var(--primary-green)' }}>
            <Zap size={22} className="text-green" />
          </div>
          <div>
            <div className="logo-text-title" style={{ fontSize: '1.1rem' }}>EV Admin</div>
            <div className="logo-text-sub" style={{ fontSize: '0.65rem' }}>Control Center</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav-list" style={{ overflowY: 'auto' }}>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Switch back to Driver Portal */}
        <NavLink to="/" className="btn-secondary text-xs" style={{ padding: '0.5rem', justifyContent: 'center' }}>
          <ArrowLeft size={14} />
          <span>Switch to Driver View</span>
        </NavLink>

        {/* Admin Footer & Logout */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-sidebar-logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="main-viewport">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="nav-icon-btn mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="navbar-page-title">
              EV Network Administration
            </div>
          </div>

          <div className="navbar-right-controls">
            <div className="navbar-search-box">
              <Search size={16} className="text-muted" />
              <input type="text" placeholder="Search system records..." />
            </div>

            {/* Theme Mode Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="nav-icon-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="navbar-user-badge">
              <div className="user-avatar" style={{ background: 'var(--primary-green-dark)' }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="user-info-text">
                <span className="user-display-name">{user?.name || 'Administrator'}</span>
                <span className="user-role-label flex items-center gap-1">
                  <ShieldCheck size={11} /> Super Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="content-container">
          {children}
        </main>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 45
          }}
        />
      )}
    </div>
  );
};

export default AdminLayout;
