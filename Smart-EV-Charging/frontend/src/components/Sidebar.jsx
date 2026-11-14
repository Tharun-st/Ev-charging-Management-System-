import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  MapPin,
  CalendarCheck,
  Bookmark,
  Zap,
  Activity,
  CreditCard,
  User,
  LogOut,
  ShieldAlert,
  Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vehicles', label: 'My Vehicles', icon: Car },
    { to: '/stations', label: 'Charging Stations', icon: MapPin },
    { to: '/fleet-map', label: 'Live Fleet Map', icon: Navigation },
    { to: '/booking', label: 'Book Charging', icon: CalendarCheck },
    { to: '/my-bookings', label: 'My Bookings', icon: Bookmark },
    { to: '/charging-session', label: 'Charging Session', icon: Zap },
    { to: '/energy-consumption', label: 'Energy Consumption', icon: Activity },
    { to: '/payment', label: 'Payments', icon: CreditCard },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Logo & Project Name */}
      <div className="sidebar-logo">
        <div className="logo-icon-wrap">
          <Zap size={24} />
        </div>
        <div>
          <div className="logo-text-title">Smart EV</div>
          <div className="logo-text-sub">ChargeNet</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Switcher if role is admin */}
      {user?.role === 'admin' && (
        <NavLink to="/admin" className="admin-switch-btn">
          <ShieldAlert size={18} />
          <span>Switch to Admin Suite</span>
        </NavLink>
      )}

      {/* Logout Action */}
      <div className="sidebar-footer">
        <button onClick={logout} className="btn-sidebar-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
