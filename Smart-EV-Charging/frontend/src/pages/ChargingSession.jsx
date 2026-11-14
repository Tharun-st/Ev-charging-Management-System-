import React, { useState, useEffect } from 'react';
import { initialActiveSession, initialStations, initialVehicles } from '../services/mockData';
import {
  Zap,
  Play,
  Square,
  Clock,
  BatteryCharging,
  DollarSign,
  Activity,
  CheckCircle,
  MapPin,
  Car
} from 'lucide-react';
import Modal from '../components/Modal';

const ChargingSession = () => {
  const [session, setSession] = useState(initialActiveSession);
  const [isCharging, setIsCharging] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(42);
  const [notice, setNotice] = useState('');

  // Start form state
  const [startStation, setStartStation] = useState(initialStations[0].station_name);
  const [startPort, setStartPort] = useState(initialStations[0].ports[0].port_number);
  const [startVehicle, setStartVehicle] = useState(initialVehicles[0].vehicle_model);

  // Live simulation ticker for active session
  useEffect(() => {
    if (!isCharging) return;

    const interval = setInterval(() => {
      setDurationMinutes(prev => prev + 1);
      setSession(prev => {
        const newEnergy = parseFloat((prev.energy_used + 0.15).toFixed(2));
        const newBattery = Math.min(prev.battery_level + 1, 100);
        const newCost = parseFloat((newEnergy * prev.tariff).toFixed(2));
        return {
          ...prev,
          energy_used: newEnergy,
          battery_level: newBattery,
          current_cost: newCost,
          current_duration: `${durationMinutes + 1} mins`
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isCharging, durationMinutes]);

  const handleStopCharging = () => {
    if (window.confirm('Are you sure you want to stop the current charging session?')) {
      setIsCharging(false);
      setSession(prev => ({
        ...prev,
        status: 'Completed'
      }));
      setNotice(`Charging completed! Final energy: ${session.energy_used} kWh. Total billed: ₹${session.current_cost}.`);
    }
  };

  const handleStartCharging = (e) => {
    e.preventDefault();
    setIsCharging(true);
    setDurationMinutes(0);
    setSession({
      session_id: Date.now(),
      station: startStation,
      port: startPort,
      vehicle: startVehicle,
      start_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      current_duration: '1 min',
      energy_used: 1.2,
      battery_level: 35,
      current_cost: 0.34,
      tariff: 0.28,
      status: 'Charging'
    });
    setShowStartModal(false);
    setNotice('New charging session started successfully.');
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <div className="charging-session-page-container">
      {/* Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Charging Session Dashboard</h1>
          <p className="welcome-sub">Live telemetry, electrical delivery rates, battery state-of-charge, and billing</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!isCharging ? (
            <button onClick={() => setShowStartModal(true)} className="btn-primary">
              <Play size={17} />
              <span>Start Charging</span>
            </button>
          ) : (
            <button onClick={handleStopCharging} className="btn-danger">
              <Square size={17} />
              <span>Stop Charging</span>
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-4 mb-4 text-sm flex items-center gap-2">
          <CheckCircle size={18} />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Session Card */}
      <div className="card-table-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className={`badge-pill ${isCharging ? 'charging' : 'completed'}`} style={{ marginBottom: '0.4rem' }}>
              {session.status}
            </span>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 800 }}>
              {session.station}
            </h2>
            <div className="text-xs text-muted font-mono mt-1">
              Port Connector: <span className="text-green font-bold">{session.port}</span> &bull; Vehicle: <span className="text-white">{session.vehicle}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-app)', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div className="info-label">Session ID</div>
              <div className="font-mono font-bold text-white text-sm">#{session.session_id}</div>
            </div>
            <div style={{ background: 'var(--bg-app)', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div className="info-label">Start Time</div>
              <div className="font-mono font-bold text-green text-sm">{session.start_time}</div>
            </div>
          </div>
        </div>

        {/* Visual Progress Indicator (Large Gauge) */}
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04))', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
            <div>
              <span className="info-label">Battery State of Charge</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                {session.battery_level}% <span className="text-sm font-normal text-muted">SOC</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="info-label">Estimated Time Remaining</span>
              <div className="font-mono text-green font-bold text-lg">
                {isCharging ? `${Math.max(100 - session.battery_level, 0) * 1.5} mins` : 'Fully Charged'}
              </div>
            </div>
          </div>

          <div className="charging-progress-track" style={{ height: '18px' }}>
            <div 
              className="charging-progress-fill" 
              style={{ width: `${session.battery_level}%` }}
            ></div>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="stats-cards-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-title">Charging Duration</span>
              <span className="stat-number font-mono" style={{ fontSize: '1.5rem' }}>{session.current_duration}</span>
              <span className="text-xs text-muted">Elapsed time</span>
            </div>
            <div className="stat-icon-container">
              <Clock size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-title">Energy Delivered</span>
              <span className="stat-number font-mono text-green" style={{ fontSize: '1.5rem' }}>{session.energy_used} kWh</span>
              <span className="text-xs text-muted">Transferred to EV</span>
            </div>
            <div className="stat-icon-container">
              <Activity size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-title">Current Cost</span>
              <span className="stat-number font-mono text-green" style={{ fontSize: '1.5rem' }}>₹{session.current_cost}</span>
              <span className="text-xs text-muted">At ₹{session.tariff || 17.50}/kWh</span>
            </div>
            <div className="stat-icon-container">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-title">Charging Status</span>
              <span className="stat-number" style={{ fontSize: '1.3rem' }}>{session.status}</span>
              <span className="text-xs text-muted">Hardware telemetry live</span>
            </div>
            <div className="stat-icon-container">
              <Zap size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Start Charging Modal */}
      <Modal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        title="Start New Charging Session"
      >
        <form onSubmit={handleStartCharging}>
          <div className="form-group">
            <label className="form-label">Select Charging Station</label>
            <select
              className="form-select"
              value={startStation}
              onChange={(e) => setStartStation(e.target.value)}
              required
            >
              {initialStations.map(s => (
                <option key={s.station_id} value={s.station_name}>
                  {s.station_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Charging Port</label>
            <input
              type="text"
              className="form-input font-mono"
              value={startPort}
              onChange={(e) => setStartPort(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Connected Vehicle</label>
            <select
              className="form-select"
              value={startVehicle}
              onChange={(e) => setStartVehicle(e.target.value)}
              required
            >
              {initialVehicles.map(v => (
                <option key={v.vehicle_id} value={v.vehicle_model}>
                  {v.vehicle_model} ({v.vehicle_number})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowStartModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Play size={16} />
              <span>Start Charging Now</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ChargingSession;
