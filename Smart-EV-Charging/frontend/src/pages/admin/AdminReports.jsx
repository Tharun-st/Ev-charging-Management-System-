import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { monthlyReportsData } from '../../services/mockData';
import {
  BarChart3,
  TrendingUp,
  Zap,
  DollarSign,
  CalendarCheck,
  MapPin,
  PlugZap,
  ArrowUpRight,
  Activity,
  Calendar
} from 'lucide-react';

const AdminReports = () => {
  const location = useLocation();

  // Support direct routing from sidebar: /admin/energy-reports or /admin/revenue-reports
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('energy-reports')) return 'energy';
    if (location.pathname.includes('revenue-reports')) return 'revenue';
    return 'all';
  });

  useEffect(() => {
    if (location.pathname.includes('energy-reports')) setActiveTab('energy');
    else if (location.pathname.includes('revenue-reports')) setActiveTab('revenue');
  }, [location.pathname]);

  const [data] = useState(monthlyReportsData);

  // Exact KPIs Requested:
  // - Total bookings
  // - Total energy consumption
  // - Total revenue
  // - Most used charging station
  // - Most used charging port
  const totalBookings = data.reduce((acc, d) => acc + d.bookings, 0);
  const totalEnergy = data.reduce((acc, d) => acc + d.energy_kwh, 0);
  const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const mostUsedStation = 'Metro EV Hub - Downtown Central (42%)';
  const mostUsedPort = 'Port P1-02 (CCS2 Fast DC 150kW)';

  const maxBookings = Math.max(...data.map(d => d.bookings));
  const maxEnergy = Math.max(...data.map(d => d.energy_kwh));
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div className="admin-reports-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Reports & Network Analytics</h1>
          <p className="welcome-sub">Comprehensive telemetry summaries, monthly consumption trends, and financial performance</p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            className={activeTab === 'all' ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
            style={{ padding: '0.45rem 0.9rem' }}
          >
            All Executive Reports
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={activeTab === 'energy' ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
            style={{ padding: '0.45rem 0.9rem' }}
          >
            Energy Reports
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={activeTab === 'revenue' ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
            style={{ padding: '0.45rem 0.9rem' }}
          >
            Revenue Reports
          </button>
        </div>
      </div>

      {/* 5 Requested Metric Cards:
          1. Total bookings
          2. Total energy consumption
          3. Total revenue
          4. Most used charging station
          5. Most used charging port
      */}
      <div className="stats-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Bookings</span>
            <span className="stat-number font-mono">{totalBookings}</span>
            <span className="text-xs text-muted flex items-center gap-1">
              <TrendingUp size={13} className="text-green" /> Across 6 months
            </span>
          </div>
          <div className="stat-icon-container">
            <CalendarCheck size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Energy Consumption</span>
            <span className="stat-number font-mono text-green">{totalEnergy} kWh</span>
            <span className="text-xs text-muted">Cumulative grid throughput</span>
          </div>
          <div className="stat-icon-container">
            <Zap size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Revenue</span>
            <span className="stat-number font-mono text-green">₹{Number(totalRevenue).toLocaleString('en-IN')}</span>
            <span className="text-xs text-muted flex items-center gap-1">
              <TrendingUp size={13} className="text-green" /> 18% month-over-month
            </span>
          </div>
          <div className="stat-icon-container">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Most Used Station</span>
            <span className="font-bold text-white text-sm" style={{ marginTop: '0.4rem', lineHeight: 1.3 }}>
              {mostUsedStation}
            </span>
            <span className="text-xs text-muted flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-green" /> Highest peak demand
            </span>
          </div>
          <div className="stat-icon-container">
            <MapPin size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Most Used Port</span>
            <span className="font-mono text-green font-bold text-sm" style={{ marginTop: '0.4rem', lineHeight: 1.3 }}>
              {mostUsedPort}
            </span>
            <span className="text-xs text-muted flex items-center gap-1 mt-1">
              <PlugZap size={12} className="text-green" /> 312 charge cycles
            </span>
          </div>
          <div className="stat-icon-container">
            <PlugZap size={22} />
          </div>
        </div>
      </div>

      {/* 3 Clean Charts Requested:
          1. Monthly booking statistics
          2. Monthly energy consumption
          3. Monthly revenue
      */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* CHART 1: Monthly Energy Consumption */}
        {(activeTab === 'all' || activeTab === 'energy') && (
          <div className="chart-container-box" style={{ margin: 0 }}>
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Monthly Energy Consumption</h3>
                <p className="text-muted text-xs mt-1">Total clean electricity delivered to charging fleet (kWh)</p>
              </div>
              <span className="text-xs font-mono text-green font-bold flex items-center gap-1">
                <Zap size={14} /> Peak: 1,280 kWh (Sep)
              </span>
            </div>

            <div className="bar-chart-strip" style={{ height: '220px' }}>
              {data.map((d, i) => {
                const height = Math.round((d.energy_kwh / maxEnergy) * 100);
                return (
                  <div key={i} className="bar-col">
                    <span className="bar-val font-mono">{d.energy_kwh}</span>
                    <div
                      className="bar-rect"
                      style={{ height: `${height}%`, minHeight: '16px' }}
                      title={`${d.month}: ${d.energy_kwh} kWh`}
                    ></div>
                    <span className="bar-label">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHART 2: Monthly Revenue */}
        {(activeTab === 'all' || activeTab === 'revenue') && (
          <div className="chart-container-box" style={{ margin: 0 }}>
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Monthly Revenue Trend</h3>
                <p className="text-muted text-xs mt-1">Total settled driver invoices and charging tariffs (₹ INR)</p>
              </div>
              <span className="text-xs font-mono text-green font-bold flex items-center gap-1">
                Peak: ₹2,36,800 (Sep)
              </span>
            </div>

            <div className="bar-chart-strip" style={{ height: '220px' }}>
              {data.map((d, i) => {
                const height = Math.round((d.revenue / maxRevenue) * 100);
                return (
                  <div key={i} className="bar-col">
                    <span className="bar-val font-mono" style={{ color: '#06B6D4' }}>₹{(d.revenue / 1000).toFixed(0)}k</span>
                    <div
                      className="bar-rect"
                      style={{
                        height: `${height}%`,
                        minHeight: '16px',
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
        )}

        {/* CHART 3: Monthly Booking Statistics */}
        {(activeTab === 'all' || activeTab === 'energy') && (
          <div className="chart-container-box" style={{ margin: 0 }}>
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Monthly Booking Statistics</h3>
                <p className="text-muted text-xs mt-1">Total reserved charging slot sessions booked by drivers</p>
              </div>
              <span className="text-xs font-mono text-green font-bold flex items-center gap-1">
                <CalendarCheck size={14} /> Peak: 112 Bookings (Sep)
              </span>
            </div>

            <div className="bar-chart-strip" style={{ height: '220px' }}>
              {data.map((d, i) => {
                const height = Math.round((d.bookings / maxBookings) * 100);
                return (
                  <div key={i} className="bar-col">
                    <span className="bar-val font-mono" style={{ color: '#F59E0B' }}>{d.bookings}</span>
                    <div
                      className="bar-rect"
                      style={{
                        height: `${height}%`,
                        minHeight: '16px',
                        background: 'linear-gradient(180deg, #F59E0B, #D97706)'
                      }}
                      title={`${d.month}: ${d.bookings} reservations`}
                    ></div>
                    <span className="bar-label">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
