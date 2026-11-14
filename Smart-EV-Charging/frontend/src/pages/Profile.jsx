import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Edit2,
  Key,
  ShieldCheck,
  CheckCircle,
  Car,
  Zap,
  CreditCard
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  // Profile data in local state
  const [profile, setProfile] = useState({
    fullName: user?.name || 'Alice Johnson',
    email: user?.email || 'alice.johnson@example.com',
    phone: user?.phone || '+1 555-0101',
    registrationDate: 'January 12, 2026'
  });

  const [notice, setNotice] = useState('');

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(profile.fullName);
  const [editPhone, setEditPhone] = useState(profile.phone);

  // Password form state
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      fullName: editName,
      phone: editPhone
    }));
    setShowEditModal(false);
    setNotice('Profile details updated successfully.');
    setTimeout(() => setNotice(''), 3500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }
    setShowPasswordModal(false);
    setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setNotice('Account password updated securely.');
    setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div className="profile-page-container">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">My Profile</h1>
          <p className="welcome-sub">Manage your driver identity, contact details, and account credentials</p>
        </div>

        {/* Action Buttons: Edit Profile & Change Password */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowEditModal(true)} className="btn-primary">
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
          <button onClick={() => setShowPasswordModal(true)} className="btn-secondary">
            <Key size={16} />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-4 mb-4 text-sm flex items-center gap-2">
          <CheckCircle size={18} />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="card-table-wrapper" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-green-dark), var(--primary-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: '0 0 20px var(--primary-green-glow)'
            }}
          >
            {profile.fullName.charAt(0)}
          </div>

          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 800 }}>{profile.fullName}</h2>
            <div className="text-xs text-muted mt-1 flex items-center gap-2">
              <span className="badge-pill active">Verified EV Driver</span>
              <span>&bull;</span>
              <span>Member since {profile.registrationDate}</span>
            </div>
          </div>
        </div>

        {/* Display Fields Requested:
            - Full name
            - Email
            - Phone
            - Registration date
        */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
          <div>
            <div className="info-label flex items-center gap-1.5">
              <User size={14} className="text-green" /> Full Name
            </div>
            <div className="info-val text-white font-semibold">{profile.fullName}</div>
          </div>

          <div>
            <div className="info-label flex items-center gap-1.5">
              <Mail size={14} className="text-green" /> Email Address
            </div>
            <div className="info-val text-white font-mono">{profile.email}</div>
          </div>

          <div>
            <div className="info-label flex items-center gap-1.5">
              <Phone size={14} className="text-green" /> Phone Number
            </div>
            <div className="info-val text-white font-mono">{profile.phone}</div>
          </div>

          <div>
            <div className="info-label flex items-center gap-1.5">
              <Calendar size={14} className="text-green" /> Registration Date
            </div>
            <div className="info-val text-white">{profile.registrationDate}</div>
          </div>
        </div>
      </div>

      {/* Account Security & Fast Actions Summary */}
      <div className="dashboard-action-split-grid">
        <div className="feature-panel-card">
          <div className="panel-card-top">
            <h3 className="panel-card-title">
              <ShieldCheck size={20} className="text-green" />
              <span>Security & Credentials</span>
            </h3>
            <span className="badge-pill active">Secured</span>
          </div>
          <p className="text-xs text-muted mb-4">
            Your account is authenticated using encrypted sessions with password hashing.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-semibold text-white mb-1">Two-Factor & Session Security</div>
            <p className="text-xs text-muted">
              Auto session expiration after inactivity. Instant lockout protection enabled.
            </p>
          </div>
        </div>

        <div className="feature-panel-card">
          <div className="panel-card-top">
            <h3 className="panel-card-title">
              <Car size={20} className="text-green" />
              <span>Registered Garage Summary</span>
            </h3>
            <span className="badge-pill active">2 Vehicles</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span className="text-muted">Primary EV:</span>
              <span className="font-semibold text-white">Tesla Model 3 Long Range (EV-CA-1001)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span className="text-muted">Secondary EV:</span>
              <span className="font-semibold text-white">Porsche Taycan 4S (EV-CA-9999)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span className="text-muted">Default Connector:</span>
              <span className="font-mono text-green">CCS2 Fast DC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile Information"
      >
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              required
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read Only)</label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="form-input font-mono opacity-60"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Account Password"
      >
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passData.currentPassword}
              onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={passData.newPassword}
              onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="Re-enter new password"
              value={passData.confirmPassword}
              onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
