import React, { useState } from 'react';
import { initialPorts, initialStations } from '../../services/mockData';
import Modal from '../../components/Modal';
import {
  PlugZap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Search,
  Plus,
  Zap,
  CheckCircle
} from 'lucide-react';

const AdminPorts = () => {
  const [ports, setPorts] = useState(initialPorts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notice, setNotice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    port_number: 'P1-05',
    station: initialStations[0].station_name,
    charger_type: 'CCS2 Fast DC (150kW)',
    status: 'Available'
  });

  // Allowed statuses: Available, Booked, Charging, Maintenance
  const statuses = ['Available', 'Booked', 'Charging', 'Maintenance'];

  const handleUpdateStatus = (portId, newStatus) => {
    setPorts(ports.map(p => p.port_id === portId ? { ...p, status: newStatus } : p));
    const target = ports.find(p => p.port_id === portId);
    setNotice(`Port ${target?.port_number} status updated to "${newStatus}".`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleAddPort = (e) => {
    e.preventDefault();
    const newPort = {
      port_id: Date.now(),
      port_number: formData.port_number,
      station: formData.station,
      charger_type: formData.charger_type,
      status: formData.status
    };

    setPorts([...ports, newPort]);
    setShowAddModal(false);
    setNotice(`New Port ${newPort.port_number} added successfully.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const filteredPorts = ports.filter(p => {
    const matchSearch =
      p.port_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.charger_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-ports-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Charging Port Management</h1>
          <p className="welcome-sub">Monitor physical hardware connectors, charger types, and toggle operational statuses</p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={18} />
          <span>Add Port</span>
        </button>
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
              placeholder="Search by port number, station, or charger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Available', 'Booked', 'Charging', 'Maintenance'].map((st) => (
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

      {/* Port List Table Requested:
          - Port list
          - Port number
          - Station
          - Charger type
          - Status (Available, Booked, Charging, Maintenance)
          - Allow admin to update port status
      */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Port Number</th>
                <th>Station</th>
                <th>Charger Type</th>
                <th>Current Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPorts.length > 0 ? (
                filteredPorts.map((p) => (
                  <tr key={p.port_id}>
                    <td className="font-mono font-bold text-white">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PlugZap size={16} className="text-green" />
                        <span>{p.port_number}</span>
                      </div>
                    </td>
                    <td className="font-semibold text-white">{p.station}</td>
                    <td className="text-xs font-mono">{p.charger_type}</td>
                    <td>
                      <span className={`badge-pill ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select text-xs font-semibold"
                        style={{ padding: '0.35rem 0.75rem', width: 'auto', minWidth: '135px' }}
                        value={p.status}
                        onChange={(e) => handleUpdateStatus(p.port_id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-8">
                    No ports matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Port Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Charging Port"
      >
        <form onSubmit={handleAddPort}>
          <div className="form-group">
            <label className="form-label">Port Number</label>
            <input
              type="text"
              required
              placeholder="e.g. P1-05"
              value={formData.port_number}
              onChange={(e) => setFormData({ ...formData, port_number: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Station</label>
            <select
              className="form-select"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
            >
              {initialStations.map(st => (
                <option key={st.station_id} value={st.station_name}>
                  {st.station_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Charger Type</label>
            <input
              type="text"
              required
              value={formData.charger_type}
              onChange={(e) => setFormData({ ...formData, charger_type: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Port
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPorts;
