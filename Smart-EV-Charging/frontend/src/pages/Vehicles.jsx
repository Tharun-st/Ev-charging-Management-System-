import React, { useState } from 'react';
import { initialVehicles } from '../services/mockData';
import Modal from '../components/Modal';
import { Car, Plus, Trash2, Edit2, BatteryCharging, CheckCircle } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  const [formData, setFormData] = useState({
    vehicle_number: '',
    vehicle_model: '',
    battery_capacity: ''
  });

  const handleOpenAdd = () => {
    setEditingVehicleId(null);
    setFormData({
      vehicle_number: '',
      vehicle_model: '',
      battery_capacity: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVehicleId(v.vehicle_id);
    setFormData({
      vehicle_number: v.vehicle_number,
      vehicle_model: v.vehicle_model,
      battery_capacity: v.battery_capacity
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle from your garage?')) {
      setVehicles(vehicles.filter(v => v.vehicle_id !== id));
      setSuccessNotice('Vehicle deleted successfully.');
      setTimeout(() => setSuccessNotice(''), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVehicleId) {
      setVehicles(vehicles.map(v => v.vehicle_id === editingVehicleId ? {
        ...v,
        vehicle_number: formData.vehicle_number,
        vehicle_model: formData.vehicle_model,
        battery_capacity: parseFloat(formData.battery_capacity)
      } : v));
      setSuccessNotice('Vehicle details updated successfully.');
    } else {
      const newV = {
        vehicle_id: Date.now(),
        user_id: 2,
        vehicle_number: formData.vehicle_number,
        vehicle_model: formData.vehicle_model,
        battery_capacity: parseFloat(formData.battery_capacity) || 60,
        port_type: 'CCS2',
        created_at: new Date().toISOString().split('T')[0]
      };
      setVehicles([...vehicles, newV]);
      setSuccessNotice('New vehicle added to your garage.');
    }
    setShowModal(false);
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  return (
    <div className="vehicles-page-container">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">My Vehicles</h1>
          <p className="welcome-sub">Manage your registered electric vehicles, plate numbers, and battery capacities</p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus size={18} />
          <span>Add Vehicle</span>
        </button>
      </div>

      {successNotice && (
        <div className="badge-pill confirmed w-full p-3 mb-4 text-xs">
          <CheckCircle size={15} />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Vehicle Cards Grid */}
      <div className="stats-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {vehicles.map((v) => (
          <div key={v.vehicle_id} className="stat-card" style={{ flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="stat-icon-container">
                  <Car size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>{v.vehicle_model}</h3>
                  <span className="text-xs font-mono text-green font-bold">{v.vehicle_number}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-xs text-muted flex items-center gap-1">
                  <BatteryCharging size={16} className="text-green" /> Battery Capacity
                </span>
                <span className="font-mono font-bold text-white">{v.battery_capacity} kWh</span>
              </div>
            </div>

            {/* Edit & Delete Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <button
                onClick={() => handleOpenEdit(v)}
                className="btn-secondary text-xs flex-1"
                style={{ padding: '0.5rem' }}
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDelete(v.vehicle_id)}
                className="btn-danger text-xs flex-1"
                style={{ padding: '0.5rem' }}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingVehicleId ? 'Edit Vehicle' : 'Add Vehicle'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vehicle Number</label>
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
            <label className="form-label">Vehicle Model</label>
            <input
              type="text"
              required
              placeholder="e.g. Tesla Model 3 Long Range, Hyundai Ioniq 5"
              value={formData.vehicle_model}
              onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Battery Capacity (kWh)</label>
            <input
              type="number"
              step="0.1"
              min="5"
              max="250"
              required
              placeholder="e.g. 75.0"
              value={formData.battery_capacity}
              onChange={(e) => setFormData({ ...formData, battery_capacity: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingVehicleId ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicles;
