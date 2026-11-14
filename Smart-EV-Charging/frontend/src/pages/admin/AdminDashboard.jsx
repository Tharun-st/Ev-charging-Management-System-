import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Car,
  MapPin,
  PlugZap,
  CheckCircle2,
  Zap,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  BatteryCharging,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  initialUsers,
  initialVehicles,
  initialStations,
  initialPorts,
  initialBookings,
  initialAllSessions,
  initialPayments,
  monthlyReportsData
} from '../../services/mockData';

const AdminDashboard = () => {
  // Real-time sample state
  const [users] = useState(initialUsers);
  const [vehicles] = useState(initialVehicles);
  const [stations] = useState(initialStations);
  const [ports] = useState(initialPorts);
  const [bookings] = useState(initialBookings);
  const [sessions] = useState(initialAllSessions);
  const [payments] = useState(initialPayments);
  const [monthlyData] = useState(monthlyReportsData);

  // 8 Specific Dashboard Statistics:
  // 1. Total Users
  // 2. Total Vehicles
  // 3. Charging Stations
  // 4. Charging Ports
  // 5. Available Ports
  // 6. Active Sessions
  // 7. Total Bookings
  // 8. Total Revenue
  const totalUsers = users.length;
  const totalVehicles = vehicles.length;
  const chargingStations = stations.length;
  const chargingPorts = ports.length;
  const availablePorts = ports.filter(p => p.status === 'Available').length;
  const activeSessions = sessions.filter(s => s.status === 'Charging').length;
  const totalBookings = bookings.length;
  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0)
    .toFixed(2);

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxEnergy = Math.max(...monthlyData.map(d => d.energy_kwh));

  return (
    <div className="admin-dashboard-view">
      {/* Header Banner */}
      <div className="dashboard-welcome-box">
        <div>
          <div className="text-xs text-green font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck size={16} /> Enterprise Administration Control
          </div>
          <h1 className="welcome-heading">EV Network Command Center</h1>
          <p className="welcome-sub">
            Real-time grid load balancing, charging station availability, and automated revenue oversight
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/map" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} className="text-green" />
            <span>Live Station Map</span>
          </Link>
          <Link to="/admin/reports" className="btn-primary">
            <span>View Detailed Reports</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 8 Statistics Cards Requested */}
      <div
        className="stats-cards-grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
      >
        {/* 1. Total Users */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Users</span>
            <span className="stat-number font-mono">{totalUsers}</span>
            <span className="text-xs text-muted">Registered EV drivers</span>
          </div>
          <div className="stat-icon-container">
            <Users size={22} />
          </div>
        </div>

        {/* 2. Total Vehicles */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Vehicles</span>
            <span className="stat-number font-mono">{totalVehicles}</span>
            <span className="text-xs text-muted">Registered in network</span>
          </div>
          <div className="stat-icon-container">
            <Car size={22} />
          </div>
        </div>

        {/* 3. Charging Stations */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Charging Stations</span>
            <span className="stat-number font-mono">{chargingStations}</span>
            <span className="text-xs text-muted">Active hub locations</span>
          </div>
          <div className="stat-icon-container">
            <MapPin size={22} />
          </div>
        </div>

        {/* 4. Charging Ports */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Charging Ports</span>
            <span className="stat-number font-mono">{chargingPorts}</span>
            <span className="text-xs text-muted">Physical connectors</span>
          </div>
          <div className="stat-icon-container">
            <PlugZap size={22} />
          </div>
        </div>

        {/* 5. Available Ports */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Available Ports</span>
            <span className="stat-number font-mono text-green">{availablePorts}</span>
            <span className="text-xs text-muted">Ready for charging</span>
          </div>
          <div className="stat-icon-container">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* 6. Active Sessions */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Active Sessions</span>
            <span className="stat-number font-mono" style={{ color: 'var(--status-charging)' }}>
              {activeSessions}
            </span>
            <span className="text-xs text-muted">Delivering electricity</span>
          </div>
          <div className="stat-icon-container" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--status-charging)' }}>
            <Zap size={22} />
          </div>
        </div>

        {/* 7. Total Bookings */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Bookings</span>
            <span className="stat-number font-mono">{totalBookings}</span>
            <span className="text-xs text-muted">Confirmed slots</span>
          </div>
          <div className="stat-icon-container">
            <CalendarCheck size={22} />
          </div>
        </div>

        {/* 8. Total Revenue */}
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Revenue</span>
            <span className="stat-number font-mono text-green">₹{Number(totalRevenue).toLocaleString('en-IN')}</span>
            <span className="text-xs text-muted flex items-center gap-1">
              <TrendingUp size={13} className="text-green" /> Settled billing
            </span>
          </div>
          <div className="stat-icon-container">
            <DollarSign size={22} />
          </div>
        </div>
      </div>

      {/* 2 Grid Sections: ACTIVE CHARGING SESSIONS & STATION AVAILABILITY */}
      <div className="dashboard-action-split-grid" style={{ marginBottom: '2rem' }}>
        {/* SECTION: ACTIVE CHARGING SESSIONS */}
        <div className="feature-panel-card">
          <div className="panel-card-top">
            <h3 className="panel-card-title">
              <Zap size={20} className="text-green" />
              <span>Active Charging Sessions</span>
            </h3>
            <span className="badge-pill charging">{activeSessions} Live</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sessions.filter(s => s.status === 'Charging').map(sess => (
              <div
                key={sess.session_id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>{sess.user}</h4>
                    <span className="text-xs text-muted font-mono">{sess.vehicle}</span>
                  </div>
                  <span className="badge-pill charging">Charging</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <div>
                    <span className="text-muted">Station & Port:</span>
                    <div className="font-semibold text-white">{sess.station} ({sess.port})</div>
                  </div>
                  <div>
                    <span className="text-muted">Duration:</span>
                    <div className="font-mono text-white">{sess.duration}</div>
                  </div>
                  <div>
                    <span className="text-muted">Energy:</span>
                    <div className="font-mono text-green font-bold">{sess.energy_consumed} kWh</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/admin/sessions" className="btn-secondary w-full text-xs mt-4">
            <span>Manage All Charging Sessions</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* SECTION: STATION AVAILABILITY */}
        <div className="feature-panel-card">
          <div className="panel-card-top">
            <h3 className="panel-card-title">
              <PlugZap size={20} className="text-green" />
              <span>Station Availability</span>
            </h3>
            <span className="badge-pill active">
              {availablePorts} of {chargingPorts} Available
            </span>
          </div>

          {/* Availability Breakdown Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <span className="text-muted">Network Wide Port Utilization</span>
              <span className="font-mono font-bold text-green">
                {Math.round(((chargingPorts - availablePorts) / chargingPorts) * 100)}% Occupied
              </span>
            </div>
            <div className="charging-progress-track" style={{ height: '12px' }}>
              <div
                className="charging-progress-fill"
                style={{ width: `${Math.round(((chargingPorts - availablePorts) / chargingPorts) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
            {stations.map(st => {
              const availPercent = Math.round((st.available_ports / st.total_ports) * 100);
              return (
                <div
                  key={st.station_id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <div className="font-semibold text-white text-sm">{st.station_name}</div>
                    <div className="text-xs text-muted">{st.location}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge-pill ${st.status === 'Active' ? 'active' : 'maintenance'}`}>
                      {st.available_ports}/{st.total_ports} Ports
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
            <Link to="/admin/stations" className="btn-secondary text-xs" style={{ justifyContent: 'center' }}>
              <span>Manage Stations</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/admin/map" className="btn-primary text-xs" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} />
              <span>Live Map View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2 Chart Sections: ENERGY CONSUMPTION & REVENUE OVERVIEW */}
      <div className="dashboard-action-split-grid" style={{ marginBottom: '2rem' }}>
        {/* SECTION: ENERGY CONSUMPTION CHART */}
        <div className="chart-container-box" style={{ margin: 0 }}>
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Energy Consumption Trend</h3>
              <p className="text-muted text-xs mt-1">Monthly electricity delivered across all hubs (kWh)</p>
            </div>
            <span className="text-xs font-mono text-green font-bold flex items-center gap-1">
              <Zap size={14} /> Total: 4,930 kWh
            </span>
          </div>

          <div className="bar-chart-strip" style={{ height: '180px' }}>
            {monthlyData.map((d, i) => {
              const height = Math.round((d.energy_kwh / maxEnergy) * 100);
              return (
                <div key={i} className="bar-col">
                  <span className="bar-val font-mono">{d.energy_kwh}</span>
                  <div
                    className="bar-rect"
                    style={{ height: `${height}%`, minHeight: '12px' }}
                    title={`${d.month}: ${d.energy_kwh} kWh`}
                  ></div>
                  <span className="bar-label">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: REVENUE OVERVIEW CHART */}
        <div className="chart-container-box" style={{ margin: 0 }}>
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Revenue Overview</h3>
              <p className="text-muted text-xs mt-1">Gross settled billing from charging sessions (₹ INR)</p>
            </div>
            <span className="text-xs font-mono text-green font-bold flex items-center gap-1">
              Total: ₹8,04,400
            </span>
          </div>

          <div className="bar-chart-strip" style={{ height: '180px' }}>
            {monthlyData.map((d, i) => {
              const height = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={i} className="bar-col">
                  <span className="bar-val font-mono" style={{ color: '#06B6D4' }}>₹{(d.revenue / 1000).toFixed(0)}k</span>
                  <div
                    className="bar-rect"
                    style={{
                      height: `${height}%`,
                      minHeight: '12px',
                      background: 'linear-gradient(180deg, #06B6D4, #0891B2)'
                    }}
                    title={`${d.month}: ₹${d.revenue.toLocaleString('en-IN')}`}
                  ></div>
                  <span className="bar-label">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION: RECENT BOOKINGS TABLE */}
      <div className="card-table-wrapper">
        <div className="table-header-bar">
          <div>
            <h3 className="table-title">Recent Bookings</h3>
            <p className="text-muted text-xs mt-1">Real-time driver slot reservations and charging statuses</p>
          </div>
          <Link to="/admin/bookings" className="btn-secondary text-xs">
            <span>View All Bookings</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Driver Name</th>
                <th>Vehicle</th>
                <th>Station</th>
                <th>Port</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map(b => (
                <tr key={b.booking_id}>
                  <td className="font-mono font-bold text-white">#BK-{b.booking_id}</td>
                  <td className="font-semibold text-white">{b.customer_name}</td>
                  <td>{b.vehicle}</td>
                  <td>{b.station}</td>
                  <td className="font-mono text-xs">{b.port}</td>
                  <td>{b.date}</td>
                  <td className="font-mono text-xs">{b.start_time} - {b.end_time}</td>
                  <td>
                    <span className={`badge-pill ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
