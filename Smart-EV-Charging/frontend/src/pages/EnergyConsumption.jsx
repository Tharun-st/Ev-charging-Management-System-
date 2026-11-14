import React, { useState } from 'react';
import { initialSessionHistory, monthlyReportsData } from '../services/mockData';
import {
  Zap,
  Activity,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Filter
} from 'lucide-react';

const EnergyConsumption = () => {
  const [sessions] = useState(initialSessionHistory);
  const [monthlyData] = useState(monthlyReportsData);
  const [activeRange, setActiveRange] = useState('6months');

  // Compute exact KPI metrics
  const totalEnergyConsumed = sessions.reduce((acc, s) => acc + s.energy_consumed, 0).toFixed(2);
  const avgEnergyPerSession = (totalEnergyConsumed / sessions.length).toFixed(2);
  const monthlyEnergyConsumption = monthlyData[monthlyData.length - 1]?.energy_kwh || 1280;

  const maxKwh = Math.max(...monthlyData.map(d => d.energy_kwh));

  return (
    <div className="energy-consumption-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Energy Consumption Analytics</h1>
          <p className="welcome-sub">Monitor cumulative clean power usage, charging session efficiency, and monthly grid draw</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveRange('7days')}
            className={activeRange === '7days' ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveRange('6months')}
            className={activeRange === '6months' ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
          >
            6 Months
          </button>
        </div>
      </div>

      {/* 3 Main KPI Summary Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Energy Consumed</span>
            <span className="stat-number font-mono text-green">
              {totalEnergyConsumed} <span className="text-sm font-normal text-muted">kWh</span>
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <TrendingUp size={14} className="text-green" /> 100% Zero-Emission Energy
            </span>
          </div>
          <div className="stat-icon-container">
            <Zap size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Average Energy Per Session</span>
            <span className="stat-number font-mono">
              {avgEnergyPerSession} <span className="text-sm font-normal text-muted">kWh</span>
            </span>
            <span className="text-xs text-muted">Typical full charge delivery</span>
          </div>
          <div className="stat-icon-container">
            <Activity size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Monthly Energy Consumption</span>
            <span className="stat-number font-mono text-white">
              {monthlyEnergyConsumption} <span className="text-sm font-normal text-muted">kWh</span>
            </span>
            <span className="text-xs text-muted">Current billing period (Sep 2026)</span>
          </div>
          <div className="stat-icon-container">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {/* Energy Consumption Chart */}
      <div className="chart-container-box">
        <div className="table-header-bar">
          <div>
            <h3 className="table-title">Energy Consumption Over Time</h3>
            <p className="text-muted text-xs mt-1">Monthly electricity delivered to registered vehicles (kWh)</p>
          </div>
          <div className="text-xs text-muted flex items-center gap-2">
            <span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--primary-green)', borderRadius: '3px' }}></span>
            <span>Monthly Grid Load (kWh)</span>
          </div>
        </div>

        <div className="bar-chart-strip" style={{ height: '220px' }}>
          {monthlyData.map((d, idx) => {
            const heightPercent = Math.round((d.energy_kwh / maxKwh) * 100);
            return (
              <div key={idx} className="bar-col">
                <span className="bar-val font-mono">{d.energy_kwh}</span>
                <div
                  className="bar-rect"
                  style={{ height: `${heightPercent}%`, minHeight: '16px' }}
                  title={`${d.month}: ${d.energy_kwh} kWh`}
                ></div>
                <span className="bar-label">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charging Session History Table */}
      <div className="card-table-wrapper">
        <div className="table-header-bar">
          <div>
            <h3 className="table-title">Charging Session History</h3>
            <p className="text-muted text-xs mt-1">Detailed log of past charges, duration, and energy delivered</p>
          </div>
        </div>

        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Date</th>
                <th>Station</th>
                <th>Energy Consumed</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.session_id}>
                  <td className="font-mono font-bold text-white">#CS-{s.session_id}</td>
                  <td>{s.date}</td>
                  <td className="font-semibold text-white">{s.station}</td>
                  <td className="font-mono text-green font-bold">{s.energy_consumed} kWh</td>
                  <td className="font-mono text-xs">{s.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnergyConsumption;
