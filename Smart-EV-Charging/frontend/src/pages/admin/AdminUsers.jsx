import React, { useState } from 'react';
import { initialUsers } from '../../services/mockData';
import Modal from '../../components/Modal';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Shield
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [notice, setNotice] = useState('');

  // Search filter
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.user_id === userId) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        setNotice(`User ${u.name} status changed to ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    setTimeout(() => setNotice(''), 3000);
  };

  const handleDeleteUser = (userId) => {
    const target = users.find(u => u.user_id === userId);
    if (window.confirm(`Are you sure you want to delete user account "${target?.name}"?`)) {
      setUsers(users.filter(u => u.user_id !== userId));
      setNotice(`User ${target?.name} deleted from the network.`);
      setTimeout(() => setNotice(''), 3000);
    }
  };

  return (
    <div className="admin-users-management">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">User Management</h1>
          <p className="welcome-sub">View registered EV drivers, manage account verification, and oversee access privileges</p>
        </div>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-3 mb-4 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* User Search Bar */}
      <div className="card-table-wrapper" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div className="navbar-search-box" style={{ width: '100%', maxWidth: '400px' }}>
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User Table Requested:
          - User ID
          - Name
          - Email
          - Phone
          - Registration date
          - Status
          - Actions
      */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.user_id}>
                    <td className="font-mono font-bold text-white">#USR-{u.user_id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--primary-green-dark)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                          }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <span className="text-xs text-muted capitalize">{u.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{u.email}</td>
                    <td className="font-mono text-xs">{u.phone}</td>
                    <td>{u.created_at}</td>
                    <td>
                      <span className={`badge-pill ${u.status === 'Active' ? 'active' : 'cancelled'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="btn-secondary text-xs"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="View user details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.user_id)}
                          className={u.status === 'Active' ? 'btn-secondary text-xs' : 'btn-primary text-xs'}
                          style={{ padding: '0.35rem 0.6rem' }}
                          title={u.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                        >
                          {u.status === 'Active' ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.user_id)}
                          className="btn-danger text-xs"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-8">
                    No users matching search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Account Details"
      >
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--primary-green-dark)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.5rem'
                }}
              >
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>{selectedUser.name}</h3>
                <span className={`badge-pill ${selectedUser.status === 'Active' ? 'active' : 'cancelled'}`}>
                  {selectedUser.status} Account
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <div className="info-label">User ID</div>
                <div className="info-val font-mono">#{selectedUser.user_id}</div>
              </div>
              <div>
                <div className="info-label">Role</div>
                <div className="info-val capitalize">{selectedUser.role}</div>
              </div>
              <div>
                <div className="info-label">Email Address</div>
                <div className="info-val font-mono text-xs">{selectedUser.email}</div>
              </div>
              <div>
                <div className="info-label">Phone Number</div>
                <div className="info-val font-mono text-xs">{selectedUser.phone}</div>
              </div>
              <div>
                <div className="info-label">Registration Date</div>
                <div className="info-val">{selectedUser.created_at}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setSelectedUser(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
