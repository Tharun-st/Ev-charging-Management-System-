import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { initialStations } from '../../services/mockData';
import Modal from '../../components/Modal';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Zap,
  PlugZap,
  DollarSign
} from 'lucide-react';

const AdminStations = () => {
  const [stations, setStations] = useState(initialStations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [viewingStation, setViewingStation] = useState(null);
  const [notice, setNotice] = useState('');

  // Station fields: Station Name, Location
  const [formData, setFormData] = useState({
    station_name: '',
    location: '',
    total_ports: 4,
    price_per_kwh: 0.30,
    charger_type: 'CCS2 Fast DC & Type 2 AC'
  });

  const handleOpenAdd = () => {
    setFormData({
      station_name: '',
      location: '',
      total_ports: 4,
      price_per_kwh: 0.30,
      charger_type: 'CCS2 Fast DC (150kW) & Type 2 AC'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStation(st);
    setFormData({
      station_name: st.station_name,
      location: st.location,
      total_ports: st.total_ports,
      price_per_kwh: st.price_per_kwh,
      charger_type: st.charger_type
    });
  };

  const handleDeleteStation = (id) => {
    const target = stations.find(s => s.station_id === id);
    if (window.confirm(`Are you sure you want to delete station "${target?.station_name}"?`)) {
      setStations(stations.filter(s => s.station_id !== id));
      setNotice(`Station "${target?.station_name}" deleted.`);
      setTimeout(() => setNotice(''), 3000);
    }
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const newStation = {
      station_id: Date.now(),
      station_name: formData.station_name,
      location: formData.location,
      total_ports: parseInt(formData.total_ports, 10) || 4,
      available_ports: parseInt(formData.total_ports, 10) || 4,
      charger_type: formData.charger_type,
      price_per_kwh: parseFloat(formData.price_per_kwh) || 0.30,
      status: 'Active',
      ports: []
    };

    setStations([...stations, newStation]);
    setShowAddModal(false);
    setNotice(`Station "${newStation.station_name}" created successfully.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setStations(stations.map(s => s.station_id === editingStation.station_id ? {
      ...s,
      station_name: formData.station_name,
      location: formData.location,
      total_ports: parseInt(formData.total_ports, 10),
      price_per_kwh: parseFloat(formData.price_per_kwh),
      charger_type: formData.charger_type
    } : s));

    setEditingStation(null);
    setNotice('Station details updated successfully.');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="admin-stations-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Charging Station Management</h1>
          <p className="welcome-sub">Configure network hubs, locations, charging rates, and port provisions</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/map" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} className="text-green" />
            <span>Open Live Station Map</span>
          </Link>
          <button onClick={handleOpenAdd} className="btn-primary">
            <Plus size={18} />
            <span>Add Station</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-3 mb-4 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Stations List / Table */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Station ID</th>
                <th>Station Name</th>
                <th>Location</th>
                <th>Total Ports</th>
                <th>Available Ports</th>
                <th>Tariff Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(st => (
                <tr key={st.station_id}>
                  <td className="font-mono font-bold text-white">#ST-{st.station_id}</td>
                  <td className="font-semibold text-white">{st.station_name}</td>
                  <td>
                    <div className="text-xs text-muted flex items-center gap-1">
                      <MapPin size={13} className="text-green" /> {st.location}
                    </div>
                  </td>
                  <td className="font-mono">{st.total_ports}</td>
                  <td className="font-mono text-green font-bold">{st.available_ports}</td>
                  <td className="font-mono">₹{st.price_per_kwh.toFixed(2)}/kWh</td>
                  <td>
                    <span className={`badge-pill ${st.status === 'Active' ? 'active' : 'maintenance'}`}>
                      {st.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                      {/* View Station */}
                      <button
                        onClick={() => setViewingStation(st)}
                        className="btn-secondary text-xs"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="View station details"
                      >
                        <Eye size={14} />
                      </button>
                      {/* Edit Station */}
                      <button
                        onClick={() => handleOpenEdit(st)}
                        className="btn-secondary text-xs"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Edit station"
                      >
                        <Edit2 size={14} />
                      </button>
                      {/* Delete Station */}
                      <button
                        onClick={() => handleDeleteStation(st.station_id)}
                        className="btn-danger text-xs"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Delete station"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Station Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Charging Station"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-group">
            <label className="form-label">Station Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Metro EV Hub - Downtown Central"
              value={formData.station_name}
              onChange={(e) => setFormData({ ...formData, station_name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              required
              placeholder="e.g. 100 Market St, Downtown"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Ports</label>
              <input
                type="number"
                min="1"
                required
                value={formData.total_ports}
                onChange={(e) => setFormData({ ...formData, total_ports: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price per kWh (₹ INR)</label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                required
                value={formData.price_per_kwh}
                onChange={(e) => setFormData({ ...formData, price_per_kwh: e.target.value })}
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Charger Hardware Specifications</label>
            <input
              type="text"
              required
              value={formData.charger_type}
              onChange={(e) => setFormData({ ...formData, charger_type: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Station
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Station Modal */}
      <Modal
        isOpen={!!editingStation}
        onClose={() => setEditingStation(null)}
        title="Edit Charging Station"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Station Name</label>
            <input
              type="text"
              required
              value={formData.station_name}
              onChange={(e) => setFormData({ ...formData, station_name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Ports</label>
              <input
                type="number"
                min="1"
                required
                value={formData.total_ports}
                onChange={(e) => setFormData({ ...formData, total_ports: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price per kWh (₹ INR)</label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                required
                value={formData.price_per_kwh}
                onChange={(e) => setFormData({ ...formData, price_per_kwh: e.target.value })}
                className="form-input font-mono"
              />
            </div>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setEditingStation(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* View Station Modal */}
      <Modal
        isOpen={!!viewingStation}
        onClose={() => setViewingStation(null)}
        title="Charging Station Overview"
      >
        {viewingStation && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'var(--primary-green-dark)',
                  color: 'var(--primary-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Zap size={30} />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>{viewingStation.station_name}</h3>
                <span className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <MapPin size={13} className="text-green" /> {viewingStation.location}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <div className="info-label">Station ID</div>
                <div className="info-val font-mono">#{viewingStation.station_id}</div>
              </div>
              <div>
                <div className="info-label">Current Status</div>
                <div className="info-val text-green">{viewingStation.status}</div>
              </div>
              <div>
                <div className="info-label">Installed Ports</div>
                <div className="info-val font-mono">{viewingStation.total_ports} Connectors</div>
              </div>
              <div>
                <div className="info-label">Available Now</div>
                <div className="info-val font-mono text-green">{viewingStation.available_ports} Ready</div>
              </div>
              <div>
                <div className="info-label">Tariff Rate</div>
                <div className="info-val font-mono">₹{viewingStation.price_per_kwh.toFixed(2)} / kWh</div>
              </div>
              <div>
                <div className="info-label">Hardware Type</div>
                <div className="info-val text-xs">{viewingStation.charger_type}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setViewingStation(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminStations;
