import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Search, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Determine current page title
  const getPageTitle = (path) => {
    if (path === '/' || path === '/dashboard') return 'User Dashboard';
    if (path.startsWith('/vehicles')) return 'My Vehicles';
    if (path.startsWith('/stations')) return 'Charging Stations';
    if (path.startsWith('/booking')) return 'Book Charging';
    if (path.startsWith('/my-bookings')) return 'My Bookings';
    if (path.startsWith('/charging-session')) return 'Charging Session';
    if (path.startsWith('/energy-consumption')) return 'Energy Consumption';
    if (path.startsWith('/payment')) return 'Payments & Billing';
    if (path.startsWith('/profile')) return 'Driver Profile';
    if (path.startsWith('/admin')) return 'Admin Control Center';
    return 'Smart EV Charging';
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <h2 className="navbar-page-title">{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="navbar-right-controls">
        {/* Search bar */}
        <div className="navbar-search-box">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search stations, vehicles, bookings..." />
        </div>

        {/* Theme Toggle Button (Light / Dark Mode as in user reference) */}
        <button
          onClick={toggleTheme}
          className="nav-icon-btn"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile */}
        {isAuthenticated ? (
          <div className="navbar-user-badge">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info-text">
              <span className="user-display-name">{user?.name || 'EV Driver'}</span>
              <span className="user-role-label">
                {user?.role === 'admin' ? 'System Admin' : 'Active Driver'}
              </span>
            </div>
            <button onClick={logout} className="nav-icon-btn" style={{ marginLeft: '0.5rem' }} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn-secondary text-xs">Sign In</Link>
            <Link to="/register" className="btn-primary text-xs">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
