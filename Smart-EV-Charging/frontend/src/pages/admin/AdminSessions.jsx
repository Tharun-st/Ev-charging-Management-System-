import React, { useState } from 'react';
import { initialAllSessions } from '../../services/mockData';
import {
  Zap,
  Search,
  CheckCircle,
  Square,
  Clock,
  BatteryCharging,
  DollarSign,
  Activity
} from 'lucide-react';

const AdminSessions = () => {
  const [sessions, setSessions] = useState(initialAllSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notice, setNotice] = useState('');

  const handleStopSession = (sessionId) => {
    if (window.confirm(`Force stop active charging session #CS-${sessionId}?`)) {
      setSessions(sessions.map(s => s.session_id === sessionId ? { ...s, status: 'Completed' } : s));
      setNotice(`Session #CS-${sessionId} has been stopped and finalized.`);
      setTimeout(() => setNotice(''), 3500);
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchSearch =
      s.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.session_id.toString().includes(searchQuery);

    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-sessions-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Charging Sessions Control</h1>
          <p className="welcome-sub">Monitor live electricity delivery rates, active sessions, power metrics, and final billings</p>
        </div>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-3 mb-4 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card-table-wrapper" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="navbar-search-box" style={{ width: '100%', maxWidth: '340px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by driver, station, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Charging', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={statusFilter === st ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
                style={{ padding: '0.45rem 0.9rem' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charging Sessions Table */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Station</th>
                <th>Port</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Energy (kWh)</th>
                <th>Cost (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length > 0 ? (
                filteredSessions.map(s => (
                  <tr key={s.session_id}>
                    <td className="font-mono font-bold text-white">#CS-{s.session_id}</td>
                    <td className="font-semibold text-white">{s.user}</td>
                    <td>{s.vehicle}</td>
                    <td>{s.station}</td>
                    <td className="font-mono text-xs">{s.port}</td>
                    <td className="font-mono text-xs">{s.start_time}</td>
                    <td className="font-mono text-xs">{s.duration}</td>
                    <td className="font-mono font-bold text-green">{s.energy_consumed} kWh</td>
                    <td className="font-mono font-bold text-white">₹{s.cost.toFixed(2)}</td>
                    <td>
                      <span className={`badge-pill ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.status === 'Charging' ? (
                        <button
                          onClick={() => handleStopSession(s.session_id)}
                          className="btn-danger text-xs"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Force stop session"
                        >
                          <Square size={13} />
                          <span>Stop</span>
                        </button>
                      ) : (
                        <span className="text-muted text-xs font-mono">Billed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center text-muted py-8">
                    No charging sessions matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSessions;
