import React, { useState } from 'react';
import { Navigation, MapPin, Clock, DollarSign, Zap, ArrowRight } from 'lucide-react';

const TripPlannerCard = () => {
  const [fromLocation, setFromLocation] = useState('Bengaluru (Indiranagar)');
  const [toLocation, setToLocation] = useState('Chennai (OMR IT Expressway)');
  const [planned, setPlanned] = useState(false);

  const handlePlan = (e) => {
    e.preventDefault();
    setPlanned(true);
  };

  return (
    <div className="feature-panel-card trip-planner-card">
      <div className="panel-card-top">
        <h3 className="panel-card-title">
          <Navigation size={20} className="text-green" />
          <span>Plan a Smart EV Trip</span>
        </h3>
        <span className="badge-pill active">Eco-Route</span>
      </div>

      <form onSubmit={handlePlan} style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label className="info-label">From</label>
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="form-input text-xs"
              style={{ padding: '0.5rem 0.75rem' }}
            />
          </div>

          <div>
            <label className="info-label">To</label>
            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="form-input text-xs"
              style={{ padding: '0.5rem 0.75rem' }}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full text-xs" style={{ padding: '0.55rem' }}>
          <Navigation size={14} />
          <span>Calculate Optimized EV Route</span>
        </button>
      </form>

      {/* Route Summary Stats (As seen in the mockup) */}
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="text-xs font-semibold text-white">Route Telemetry Summary</span>
          <span className="text-xs text-green font-mono font-bold">100% Guaranteed Charge</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-app)', padding: '0.5rem', borderRadius: '8px' }}>
            <div className="text-xs text-muted">Distance</div>
            <div className="font-mono font-bold text-white text-sm">340 km</div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.5rem', borderRadius: '8px' }}>
            <div className="text-xs text-muted">Duration</div>
            <div className="font-mono font-bold text-white text-sm">4.5 hr</div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.5rem', borderRadius: '8px' }}>
            <div className="text-xs text-muted">Cost</div>
            <div className="font-mono font-bold text-green text-sm">₹850</div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.5rem', borderRadius: '8px' }}>
            <div className="text-xs text-muted">EV Stops</div>
            <div className="font-mono font-bold text-cyan text-sm">2 Hubs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlannerCard;
