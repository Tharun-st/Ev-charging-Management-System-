import React, { useState } from 'react';
import { initialVehicles } from '../../services/mockData';
import Modal from '../../components/Modal';
import {
  Car,
  Search,
  BatteryCharging,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  Filter
} from 'lucide-react';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [notice, setNotice] = useState('');

  const [formData, setFormData] = useState({
    user_name: 'Alice Johnson',
    vehicle_model: '',
    vehicle_number: '',
    battery_capacity: '75',
    port_type: 'CCS2 Fast DC'
  });

  const filteredVehicles = vehicles.filter(v =>
    v.vehicle_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.user_name && v.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id) => {
    if (window.confirm('Delete this registered vehicle from the system?')) {
      setVehicles(vehicles.filter(v => v.vehicle_id !== id));
      setNotice('Vehicle removed from system database.');
      setTimeout(() => setNotice(''), 3000);
    }
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const newV = {
      vehicle_id: Date.now(),
      user_id: 2,
      user_name: formData.user_name,
      vehicle_model: formData.vehicle_model,
      vehicle_number: formData.vehicle_number,
      battery_capacity: parseFloat(formData.battery_capacity) || 60,
      port_type: formData.port_type,
      created_at: new Date().toISOString().split('T')[0]
    };

    setVehicles([...vehicles, newV]);
    setShowModal(false);
    setNotice(`Vehicle ${newV.vehicle_number} registered successfully.`);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="admin-vehicles-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Network Vehicles Management</h1>
          <p className="welcome-sub">All registered electric vehicles, battery ratings, connector types, and owner mappings</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          <span>Register Vehicle</span>
        </button>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-3 mb-4 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="card-table-wrapper" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div className="navbar-search-box" style={{ width: '100%', maxWidth: '400px' }}>
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by vehicle model, number plate, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Owner / Driver</th>
                <th>Vehicle Model</th>
                <th>Plate Number</th>
                <th>Battery Capacity</th>
                <th>Port Type</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(v => (
                  <tr key={v.vehicle_id}>
                    <td className="font-mono font-bold text-white">#VEH-{v.vehicle_id}</td>
                    <td className="font-semibold text-white">{v.user_name || 'Alice Johnson'}</td>
                    <td>{v.vehicle_model}</td>
                    <td className="font-mono text-green font-bold">{v.vehicle_number}</td>
                    <td className="font-mono">{v.battery_capacity} kWh</td>
                    <td>
                      <span className="badge-pill active">{v.port_type}</span>
                    </td>
                    <td>{v.created_at}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedVehicle(v)}
                          className="btn-secondary text-xs"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.vehicle_id)}
                          className="btn-danger text-xs"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="Delete vehicle"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-8">
                    No vehicles found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register Vehicle into Fleet"
      >
        <form onSubmit={handleAddVehicle}>
          <div className="form-group">
            <label className="form-label">Driver / Owner Name</label>
            <input
              type="text"
              required
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle Model</label>
            <input
              type="text"
              required
              placeholder="e.g. Tesla Model 3 Long Range"
              value={formData.vehicle_model}
              onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Plate / Vehicle Number</label>
            <input
              type="text"
              required
              placeholder="e.g. EV-CA-1001"
              value={formData.vehicle_number}
              onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Battery Capacity (kWh)</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="75.0"
              value={formData.battery_capacity}
              onChange={(e) => setFormData({ ...formData, battery_capacity: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Connector Port Type</label>
            <select
              className="form-select"
              value={formData.port_type}
              onChange={(e) => setFormData({ ...formData, port_type: e.target.value })}
            >
              <option value="CCS2 Fast DC">CCS2 Fast DC</option>
              <option value="CCS2 Ultra-Fast DC">CCS2 Ultra-Fast DC</option>
              <option value="Type 2 AC">Type 2 AC</option>
              <option value="CHAdeMO Fast DC">CHAdeMO Fast DC</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* View Vehicle Modal */}
      <Modal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title="Vehicle Fleet Details"
      >
        {selectedVehicle && (
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
                <Car size={30} />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>{selectedVehicle.vehicle_model}</h3>
                <span className="font-mono text-green font-bold">{selectedVehicle.vehicle_number}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <div className="info-label">Owner Driver</div>
                <div className="info-val">{selectedVehicle.user_name || 'Alice Johnson'}</div>
              </div>
              <div>
                <div className="info-label">Battery Capacity</div>
                <div className="info-val font-mono">{selectedVehicle.battery_capacity} kWh</div>
              </div>
              <div>
                <div className="info-label">Port Hardware</div>
                <div className="info-val">{selectedVehicle.port_type}</div>
              </div>
              <div>
                <div className="info-label">Added to Garage</div>
                <div className="info-val">{selectedVehicle.created_at}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setSelectedVehicle(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminVehicles;
