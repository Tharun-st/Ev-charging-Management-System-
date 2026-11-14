import React, { useState } from 'react';
import {
  BatteryCharging,
  Gauge,
  Thermometer,
  Lock,
  Unlock,
  Lightbulb,
  Fan,
  Car,
  ChevronRight,
  Zap,
  Flame,
  Clock,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CarHeroCard = () => {
  const [chargeLimit, setChargeLimit] = useState('80%');
  const [preconditioning, setPreconditioning] = useState(true);
  const [smartEco, setSmartEco] = useState(true);
  const [locked, setLocked] = useState(true);
  const [lights, setLights] = useState(false);
  const [climate, setClimate] = useState(true);

  return (
    <div className="car-hero-showcase-card">
      <div className="car-hero-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon-container" style={{ width: '42px', height: '42px' }}>
            <Car size={22} />
          </div>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 850 }}>Tesla Model 3 Long Range</h3>
            <span className="text-xs font-mono text-green font-bold">EV-CA-1001 &bull; Connected &bull; Ready</span>
          </div>
        </div>

        {/* Smart EV Charging Controls: Charge Limit Target & Pre-conditioning */}
        <div className="car-hero-charge-tools" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Charge Limit Pills (80% Daily / 100% Roadtrip) */}
          <div className="charge-limit-selector" title="Set charging target limit">
            <span className="limit-label text-xs text-muted" style={{ marginRight: '4px' }}>Limit:</span>
            {['80%', '90%', '100%'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setChargeLimit(lvl)}
                className={`gear-btn ${chargeLimit === lvl ? 'active' : ''}`}
                style={{ width: 'auto', padding: '0 8px', fontSize: '0.75rem' }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Battery Pre-conditioning Toggle */}
          <button
            type="button"
            onClick={() => setPreconditioning(!preconditioning)}
            className={`control-pill-btn ${preconditioning ? 'active' : ''}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            title="Pre-warm/cool battery cells for peak 150kW+ DC charging speeds"
          >
            <Flame size={13} className={preconditioning ? 'text-volt spin-icon' : ''} />
            <span>{preconditioning ? 'Pre-conditioned' : 'Pre-heat Cells'}</span>
          </button>

          {/* Quick Map Link */}
          <Link
            to="/fleet-map"
            className="btn-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}
          >
            <Navigation size={13} />
            <span>Map Ports</span>
          </Link>
        </div>
      </div>

      {/* Center: Sleek EV Graphic Representation & Battery Status */}
      <div className="car-visual-area">
        {/* SVG EV Car Top/Perspective Silhouette */}
        <div className="car-render-frame">
          <svg viewBox="0 0 400 160" className="car-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="carGrad" x1="0" y1="0" x2="400" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1E293B" />
                <stop offset="0.5" stopColor="#334155" />
                <stop offset="1" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="glowGrad" x1="50" y1="0" x2="350" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="1" stopColor="#06B6D4" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Aerodynamic car chassis */}
            <path
              d="M40 115 C70 115, 80 85, 120 70 C160 55, 230 55, 275 68 C315 80, 335 110, 365 115 C375 117, 375 125, 360 128 C340 132, 70 132, 45 128 C35 125, 35 117, 40 115 Z"
              fill="url(#carGrad)"
              stroke="#64748B"
              strokeWidth="2"
            />
            {/* Windshield & Cabin */}
            <path
              d="M130 68 C160 57, 225 57, 260 67 C275 80, 280 92, 282 95 L120 95 C122 88, 125 78, 130 68 Z"
              fill="#064E3B"
              fillOpacity="0.4"
              stroke="url(#glowGrad)"
              strokeWidth="2"
            />
            {/* Front LED Light bar */}
            <ellipse cx="362" cy="115" rx="6" ry="3" fill="#34D399" />
            {/* Rear Tail light bar */}
            <ellipse cx="42" cy="116" rx="5" ry="3" fill="#F43F5E" />
            {/* Wheels */}
            <circle cx="95" cy="128" r="18" fill="#0F172A" stroke="#10B981" strokeWidth="4" />
            <circle cx="95" cy="128" r="8" fill="#64748B" />
            <circle cx="305" cy="128" r="18" fill="#0F172A" stroke="#10B981" strokeWidth="4" />
            <circle cx="305" cy="128" r="8" fill="#64748B" />
            {/* Underglow accent */}
            <line x1="80" y1="140" x2="320" y2="140" stroke="#10B981" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        {/* Quick telemetry pills on the right */}
        <div className="car-metrics-column">
          <div className="car-metric-badge">
            <div className="metric-badge-icon text-green">
              <BatteryCharging size={18} />
            </div>
            <div>
              <div className="text-xs text-muted">Battery SOC</div>
              <div className="font-mono font-bold text-white text-base">90% <span className="text-xs text-green font-normal">(420 km)</span></div>
            </div>
          </div>

          <div className="car-metric-badge">
            <div className="metric-badge-icon text-cyan">
              <Thermometer size={18} />
            </div>
            <div>
              <div className="text-xs text-muted">Cabin Temp</div>
              <div className="font-mono font-bold text-white text-base">22°C <span className="text-xs text-muted font-normal">Optimal</span></div>
            </div>
          </div>

          <div className="car-metric-badge">
            <div className="metric-badge-icon text-volt">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-xs text-muted">Health (SOH)</div>
              <div className="font-mono font-bold text-green text-base">98.5% <span className="text-xs text-muted font-normal">Grade A</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Fast Quick Controls (Lock, Lights, Climate) */}
      <div className="car-quick-controls-bar">
        <button
          type="button"
          onClick={() => setLocked(!locked)}
          className={`control-pill-btn ${locked ? 'active' : ''}`}
        >
          {locked ? <Lock size={15} /> : <Unlock size={15} />}
          <span>{locked ? 'Vehicle Locked' : 'Vehicle Unlocked'}</span>
        </button>

        <button
          type="button"
          onClick={() => setLights(!lights)}
          className={`control-pill-btn ${lights ? 'active' : ''}`}
        >
          <Lightbulb size={15} />
          <span>{lights ? 'Lights ON' : 'Lights OFF'}</span>
        </button>

        <button
          type="button"
          onClick={() => setClimate(!climate)}
          className={`control-pill-btn ${climate ? 'active' : ''}`}
        >
          <Fan size={15} />
          <span>{climate ? 'Climate AC (22°C)' : 'Climate OFF'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSmartEco(!smartEco)}
          className={`control-pill-btn ${smartEco ? 'active' : ''}`}
          title="Charge automatically during cheapest off-peak grid tariff ($0.18/kWh)"
        >
          <Clock size={15} />
          <span>{smartEco ? 'Eco Off-Peak ($0.18/kWh)' : 'Charge Immediately'}</span>
        </button>
      </div>
    </div>
  );
};

export default CarHeroCard;
