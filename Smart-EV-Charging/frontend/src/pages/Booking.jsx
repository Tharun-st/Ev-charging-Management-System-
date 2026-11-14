import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initialStations, initialVehicles, initialBookings } from '../services/mockData';
import { CalendarCheck, MapPin, Zap, Clock, DollarSign, CheckCircle2, Car, AlertCircle } from 'lucide-react';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedStationId = searchParams.get('stationId');
  const preselectedPortId = searchParams.get('portId');

  const [stations] = useState(initialStations);
  const [vehicles] = useState(initialVehicles);

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.vehicle_id || '');
  const [selectedStationId, setSelectedStationId] = useState(preselectedStationId || stations[0]?.station_id || '');
  const [selectedPortId, setSelectedPortId] = useState(preselectedPortId || '');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');

  const [successNotice, setSuccessNotice] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const stId = searchParams.get('stationId');
    const ptId = searchParams.get('portId');
    if (stId) setSelectedStationId(stId);
    if (ptId) setSelectedPortId(ptId);
  }, [searchParams]);

  // Derive selected station and port details
  const selectedStation = stations.find(s => s.station_id === parseInt(selectedStationId, 10)) || stations[0];
  const availablePorts = selectedStation?.ports || [];
  const selectedPort = availablePorts.find(p => p.port_id === parseInt(selectedPortId, 10)) || availablePorts[0];
  const selectedVehicle = vehicles.find(v => v.vehicle_id === parseInt(selectedVehicleId, 10)) || vehicles[0];

  // Auto select port if empty or invalid for station
  useEffect(() => {
    if (availablePorts.length > 0) {
      const match = availablePorts.find(p => p.port_id === parseInt(selectedPortId, 10));
      if (!match) {
        const firstAvail = availablePorts.find(p => p.status === 'Available') || availablePorts[0];
        if (firstAvail) setSelectedPortId(firstAvail.port_id);
      }
    }
  }, [selectedStationId, availablePorts, selectedPortId]);

  // Estimated charging cost calculation: (duration in hours) * (assumed 40 kWh / hr for fast DC, or 11 for AC) * (station rate)
  const calculateDurationHours = () => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const diffM = (endH * 60 + endM) - (startH * 60 + startM);
    return diffM > 0 ? (diffM / 60) : 1;
  };

  const durationHours = calculateDurationHours();
  const powerDelivered = selectedPort?.port_type.includes('Fast') ? 45 : 15;
  const estimatedCost = (durationHours * powerDelivered * (selectedStation?.price_per_kwh || 0.28)).toFixed(2);

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setSuccessNotice(true);
    setTimeout(() => {
      navigate('/my-bookings');
    }, 2000);
  };

  return (
    <div className="booking-page-container">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Book Charging Slot</h1>
          <p className="welcome-sub">Reserve a guaranteed charging connector port in advance with live price estimation</p>
        </div>
      </div>

      {successNotice && (
        <div className="badge-pill confirmed w-full p-4 mb-4 text-sm" style={{ justifyContent: 'center' }}>
          <CheckCircle2 size={18} />
          <span>Booking successfully confirmed! Redirecting to My Bookings...</span>
        </div>
      )}

      <div className="dashboard-action-split-grid" style={{ alignItems: 'flex-start' }}>
        {/* LEFT: Booking Form */}
        <div className="card-table-wrapper" style={{ margin: 0 }}>
          <h3 className="table-title mb-4 flex items-center gap-2">
            <CalendarCheck size={20} className="text-green" />
            <span>Reservation Details</span>
          </h3>

          <form onSubmit={handleConfirmBooking}>
            {/* 1. Select Vehicle */}
            <div className="form-group">
              <label className="form-label">Select Vehicle</label>
              <select
                className="form-select"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                required
              >
                {vehicles.map(v => (
                  <option key={v.vehicle_id} value={v.vehicle_id}>
                    {v.vehicle_model} ({v.vehicle_number}) - {v.battery_capacity} kWh
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Select Charging Station */}
            <div className="form-group">
              <label className="form-label">Select Charging Station</label>
              <select
                className="form-select"
                value={selectedStationId}
                onChange={(e) => {
                  setSelectedStationId(e.target.value);
                  setSelectedPortId('');
                }}
                required
              >
                {stations.filter(s => s.status === 'Active').map(st => (
                  <option key={st.station_id} value={st.station_id}>
                    {st.station_name} ({st.location}) - ₹{st.price_per_kwh}/kWh
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Select Charging Port */}
            <div className="form-group">
              <label className="form-label">Select Charging Port</label>
              <select
                className="form-select"
                value={selectedPortId}
                onChange={(e) => setSelectedPortId(e.target.value)}
                required
              >
                {availablePorts.map(p => (
                  <option key={p.port_id} value={p.port_id} disabled={p.status === 'Maintenance'}>
                    {p.port_number} - {p.port_type} ({p.power_rating} kW) [{p.status}]
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Select Date */}
            <div className="form-group">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-input font-mono"
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>

            {/* 5. Start & End Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-input font-mono"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-input font-mono"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button type="submit" className="btn-primary w-full py-3 mt-4">
              <CalendarCheck size={18} />
              <span>Confirm Booking</span>
            </button>
          </form>
        </div>

        {/* RIGHT: Selected Station & Cost Summary */}
        <div className="feature-panel-card" style={{ margin: 0 }}>
          <div className="panel-card-top">
            <h3 className="panel-card-title">
              <Zap size={20} className="text-green" />
              <span>Selected Station Summary</span>
            </h3>
            <span className="badge-pill active">
              Active Hub
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
              {selectedStation?.station_name}
            </h4>
            <div className="text-xs text-muted flex items-center gap-1 mb-3">
              <MapPin size={13} className="text-green" /> {selectedStation?.location}
            </div>

            {preselectedPortId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent-emerald)', marginBottom: '0.75rem', fontWeight: 600 }}>
                <CheckCircle2 size={14} />
                <span>Targeted Connector from Live Map: Port {selectedPort?.port_number}</span>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="text-muted">Assigned Port:</span>
                <span className="font-mono text-green font-bold">{selectedPort?.port_number} &bull; {selectedPort?.power_rating} kW</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="text-muted">Charger Type:</span>
                <span className="font-semibold text-white">{selectedPort?.port_type || selectedStation?.charger_type}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="text-muted">Port Status:</span>
                <span className={`badge-pill ${selectedPort?.status === 'Available' ? 'available' : 'pending'}`}>
                  {selectedPort?.status || 'Available'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="text-muted">Tariff Rate:</span>
                <span className="font-mono text-white font-bold">₹{selectedStation?.price_per_kwh.toFixed(2)} / kWh</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="text-muted">Reservation Window:</span>
                <span className="font-mono text-green">{bookingDate} ({startTime} - {endTime})</span>
              </div>
            </div>
          </div>

          {/* Estimated Cost Box */}
          <div style={{ background: 'var(--primary-green-deep)', border: '1px solid var(--primary-green)', padding: '1.25rem', borderRadius: '10px' }}>
            <div className="info-label" style={{ color: 'var(--primary-green-light)' }}>
              Estimated Charging Cost
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                ₹{estimatedCost}
              </span>
              <span className="text-xs text-muted">est. for {durationHours.toFixed(1)} hrs</span>
            </div>
            <p className="text-xs text-muted mt-2">
              Based on {powerDelivered} kW transfer rate & ₹{selectedStation?.price_per_kwh}/kWh rate. Actual bill settled on energy delivered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
