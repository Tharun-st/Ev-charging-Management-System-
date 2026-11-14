import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, User, Mail, Phone, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* LEFT SIDE: Brand & Overview */}
      <div className="auth-hero-side">
        <div className="auth-brand-logo">
          <div className="logo-icon-wrap">
            <Zap size={28} />
          </div>
          <div>
            <div className="logo-text-title">SMART EV</div>
            <div className="logo-text-sub">REGISTRATION</div>
          </div>
        </div>

        <div className="auth-hero-content">
          <h1 className="auth-hero-title">
            Join the Smart EV Charging Network
          </h1>
          <p className="auth-hero-tagline">
            "Smart and Efficient EV Charging Management"
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <CheckCircle size={18} className="text-green" />
              <span>Instant vehicle garage registration (CCS2, Type 2, CHAdeMO)</span>
            </div>
            <div className="auth-feature-item">
              <CheckCircle size={18} className="text-green" />
              <span>Priority slot reservations at 12+ premium charging hubs</span>
            </div>
            <div className="auth-feature-item">
              <CheckCircle size={18} className="text-green" />
              <span>Real-time battery SOC telemetry and digital receipts</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted">
          Secure Authentication &bull; Bcrypt Encrypted &bull; 2026
        </div>
      </div>

      {/* RIGHT SIDE: Registration Form */}
      <div className="auth-form-side">
        <div className="auth-form-card" style={{ maxWidth: '480px' }}>
          <h2 className="auth-form-title">Create Driver Account</h2>
          <p className="auth-form-subtitle">Register to begin booking and charging your electric vehicle</p>

          {error && (
            <div className="badge-pill cancelled w-full p-3 mb-4 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Alice Johnson"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+1 555-0100"
                value={formData.phone}
                onChange={handleChange}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input font-mono"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating Account...' : 'Register Driver Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-switch-link">
            Already have an account? <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
