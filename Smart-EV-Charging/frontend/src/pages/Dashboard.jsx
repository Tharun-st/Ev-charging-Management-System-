import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Car,
  CalendarCheck,
  Zap,
  DollarSign,
  Clock,
  BatteryCharging,
  ArrowRight,
  PlusCircle,
  MapPin,
  CheckCircle,
  ExternalLink,
  Navigation
} from 'lucide-react';
import {
  initialVehicles,
  initialBookings,
  initialActiveSession,
  initialEnergyChartData,
  initialSessionHistory
} from '../services/mockData';
import TripPlannerCard from '../components/TripPlannerCard';
import TariffPlansCard from '../components/TariffPlansCard';

const Dashboard = () => {
  const { user } = useAuth();

  // Sample UI data
  const [vehicles] = useState(initialVehicles);
  const [bookings] = useState(initialBookings);
  const [activeSession] = useState(initialActiveSession);
  const [chartData] = useState(initialEnergyChartData);

  // Derive user specific stats
  const totalVehicles = vehicles.filter(v => v.user_id === (user?.user_id || 2)).length || 2;
  const userBookings = bookings.filter(b => b.user_id === (user?.user_id || 2));
  const totalBookings = userBookings.length || 2;
  const totalEnergy = '86.55 kWh';
  const totalSpent = '₹1,560';

  // Upcoming booking
  const upcomingBooking = userBookings.find(b => b.status === 'Confirmed') || bookings[0];

  const maxKwh = Math.max(...chartData.map(d => d.kwh));

  return (
    <div className="user-dashboard-container">
      {/* 1. Welcome Section */}
      <div className="dashboard-welcome-box">
        <div>
          <h1 className="welcome-heading">Welcome back, {user?.name || 'User'}!</h1>
          <p className="welcome-sub">
            Smart EV Charging Network &bull; Live Telemetry, Slot Reservations & Garage Health
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/fleet-map" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Navigation size={17} />
            <span>Live Fleet Map</span>
          </Link>
          <Link to="/booking" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarCheck size={17} />
            <span>Book Charging</span>
          </Link>
          <Link to="/stations" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={17} />
            <span>Find Stations</span>
          </Link>
        </div>
      </div>

      {/* 2. Four Statistics Cards Requested:
          1. My Vehicles
          2. Total Bookings
          3. Energy Consumed
          4. Total Spent
      */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">My Vehicles</span>
            <span className="stat-number font-mono">{totalVehicles}</span>
            <span className="text-xs text-muted">Registered in garage</span>
          </div>
          <div className="stat-icon-container">
            <Car size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Bookings</span>
            <span className="stat-number font-mono">{totalBookings}</span>
            <span className="text-xs text-muted">Active reservations</span>
          </div>
          <div className="stat-icon-container">
            <CalendarCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Energy Consumed</span>
            <span className="stat-number font-mono text-green">{totalEnergy}</span>
            <span className="text-xs text-muted">Clean power charged</span>
          </div>
          <div className="stat-icon-container">
            <Zap size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Spent</span>
            <span className="stat-number font-mono text-green">{totalSpent}</span>
            <span className="text-xs text-muted">Settled payments</span>
          </div>
          <div className="stat-icon-container">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* 3. Upcoming Booking & Active Charging Session Cards */}
      <div className="dashboard-action-split-grid">
        {/* UPCOMING BOOKING */}
        <div className="feature-panel-card">
          <div className="panel-card-top">
            <h3 className="panel-card-title">
              <CalendarCheck size={20} className="text-green" />
              <span>Upcoming Booking</span>
            </h3>
            {upcomingBooking && (
              <span className={`badge-pill ${upcomingBooking.status.toLowerCase()}`}>
                {upcomingBooking.status}
              </span>
            )}
          </div>

          {upcomingBooking ? (
            <div>
              <div className="panel-info-grid">
                <div>
                  <div className="info-label">Charging Station</div>
                  <div className="info-val">{upcomingBooking.station}</div>
                </div>

                <div>
                  <div className="info-label">Vehicle</div>
                  <div className="info-val text-green">{upcomingBooking.vehicle}</div>
                </div>

                <div>
                  <div className="info-label">Scheduled Date</div>
                  <div className="info-val">{upcomingBooking.date}</div>
                </div>

                <div>
                  <div className="info-label">Slot Time</div>
                  <div className="info-val font-mono">{upcomingBooking.start_time} - {upcomingBooking.end_time}</div>
                </div>

                <div>
                  <div className="info-label">Charging Port</div>
                  <div className="info-val font-mono text-xs">{upcomingBooking.port}</div>
                </div>

                <div>
                  <div className="info-label">Booking Reference</div>
                  <div className="info-val font-mono">#BK-{upcomingBooking.booking_id}</div>
                </div>
              </div>

              <Link to="/my-bookings" className="btn-primary w-full">
                <span>View Booking Details</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="text-muted text-sm py-8 text-center">
              No upcoming bookings scheduled.
            </div>
          )}
        </div>

        {/* ACTIVE CHARGING SESSION */}
        <div className="feature-panel-card">
          <div className="panel-card-top">
            <h3 className="panel-card-title">
              <BatteryCharging size={20} className="text-green" />
              <span>Active Charging Session</span>
            </h3>
            <span className="badge-pill charging">
              {activeSession.status}
            </span>
          </div>

          <div>
            <div className="panel-info-grid">
              <div>
                <div className="info-label">Station</div>
                <div className="info-val">{activeSession.station}</div>
              </div>

              <div>
                <div className="info-label">Port Connector</div>
                <div className="info-val font-mono text-xs">{activeSession.port}</div>
              </div>

              <div>
                <div className="info-label">Energy Delivered</div>
                <div className="info-val text-green font-mono">{activeSession.energy_used} kWh</div>
              </div>

              <div>
                <div className="info-label">Charging Duration</div>
                <div className="info-val font-mono">{activeSession.current_duration}</div>
              </div>

              <div>
                <div className="info-label">Current Cost</div>
                <div className="info-val text-green font-bold font-mono">₹{activeSession.current_cost}</div>
              </div>

              <div>
                <div className="info-label">Vehicle Connected</div>
                <div className="info-val">{activeSession.vehicle}</div>
              </div>
            </div>

            {/* Visual Battery Progress Indicator */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <span className="text-muted">Current Battery SOC</span>
                <span className="font-bold text-green font-mono">{activeSession.battery_level}%</span>
              </div>
              <div className="charging-progress-track">
                <div
                  className="charging-progress-fill"
                  style={{ width: `${activeSession.battery_level}%` }}
                ></div>
              </div>
            </div>

            <Link to="/charging-session" className="btn-secondary w-full">
              <span>View Live Session Control</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Energy Consumption Chart & Trip Planner */}
      <div className="dashboard-action-split-grid" style={{ marginBottom: '2rem' }}>
        <div className="chart-container-box" style={{ margin: 0 }}>
          <div className="table-header-bar">
            <div>
              <h3 className="table-title">Energy Consumption Over Time</h3>
              <p className="text-muted text-xs mt-1">Daily energy consumed (kWh) across recent charging sessions</p>
            </div>
            <div className="text-xs text-muted flex items-center gap-2">
              <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'var(--primary-green)', borderRadius: '2px' }}></span>
              <span>kWh Consumed</span>
            </div>
          </div>

          <div className="bar-chart-strip">
            {chartData.map((d, i) => {
              const heightPercent = Math.round((d.kwh / maxKwh) * 100);
              return (
                <div key={i} className="bar-col">
                  <span className="bar-val">{d.kwh}</span>
                  <div
                    className="bar-rect"
                    style={{ height: `${heightPercent}%`, minHeight: '12px' }}
                    title={`${d.label}: ${d.kwh} kWh`}
                  ></div>
                  <span className="bar-label">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <TripPlannerCard />
      </div>

      {/* 5. Recent Bookings Table */}
      <div className="card-table-wrapper">
        <div className="table-header-bar">
          <div>
            <h3 className="table-title">Recent Bookings</h3>
            <p className="text-muted text-xs mt-1">Review your recent slot reservations and statuses</p>
          </div>
          <Link to="/my-bookings" className="btn-secondary text-xs">
            <span>View All Bookings</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Station</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 4).map((b) => (
                <tr key={b.booking_id}>
                  <td className="font-mono font-bold text-white">#BK-{b.booking_id}</td>
                  <td className="font-semibold text-white">{b.station}</td>
                  <td>{b.vehicle}</td>
                  <td>{b.date}</td>
                  <td className="font-mono text-xs">{b.start_time} - {b.end_time}</td>
                  <td>
                    <span className={`badge-pill ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <Link to="/my-bookings" className="text-green text-xs font-semibold hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Tariffs Breakdown */}
      <TariffPlansCard />
    </div>
  );
};

export default Dashboard;
