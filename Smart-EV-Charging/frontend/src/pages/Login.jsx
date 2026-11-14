import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, BatteryCharging, CheckCircle, Key } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('alice.johnson@example.com');
  const [password, setPassword] = useState('user123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@smartev.com');
      setPassword('admin123');
    } else {
      setEmail('alice.johnson@example.com');
      setPassword('user123');
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* LEFT SIDE: EV Charging Illustration & Project Branding */}
      <div className="auth-hero-side">
        <div className="auth-brand-logo">
          <div className="logo-icon-wrap">
            <Zap size={28} />
          </div>
          <div>
            <div className="logo-text-title">SMART EV</div>
            <div className="logo-text-sub">CHARGING NETWORK</div>
          </div>
        </div>

        <div className="auth-hero-content">
          <h1 className="auth-hero-title">
            SMART EV CHARGING MANAGEMENT SYSTEM
          </h1>
          <p className="auth-hero-tagline">
            "Smart and Efficient EV Charging Management"
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <CheckCircle size={18} className="text-green" />
              <span>Real-Time Charging Station & Port Availability</span>
            </div>
            <div className="auth-feature-item">
              <CheckCircle size={18} className="text-green" />
              <span>Instant Slot Booking & Overlap Prevention</span>
            </div>
            <div className="auth-feature-item">
              <CheckCircle size={18} className="text-green" />
              <span>Live Battery Telemetry, Energy Tracking & Billing</span>
            </div>
            <div className="auth-feature-item">
              <CheckCircle size={18} className="text-green" />
              <span>Comprehensive ADBMS Analytics & Role-Based Control</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted">
          College Project Presentation &bull; Relational ADBMS Foundation &bull; 2026
        </div>
      </div>

      {/* RIGHT SIDE: Clean Login Form */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <h2 className="auth-form-title">Account Sign In</h2>
          <p className="auth-form-subtitle">Enter your credentials to access the EV Charging Portal</p>

          {error && (
            <div className="badge-pill cancelled w-full p-3 mb-4 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input font-mono"
              />
            </div>

            <div className="form-row-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Default test passwords are:\nadmin@smartev.com -> admin123\nalice.johnson@example.com -> user123'); }} className="text-xs text-green font-semibold">
                Forgot password?
              </a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing In...' : 'Login to Dashboard'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="text-xs text-muted mb-2 font-semibold flex items-center gap-1">
              <Key size={14} /> Quick One-Click Fill:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('driver')}
                className="btn-secondary text-xs flex-1"
              >
                EV Driver Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="btn-secondary text-xs flex-1"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="auth-switch-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
