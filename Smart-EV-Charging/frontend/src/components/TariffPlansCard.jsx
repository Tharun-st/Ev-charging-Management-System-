import React from 'react';
import { Zap, Clock, ShieldCheck, Check } from 'lucide-react';

const TariffPlansCard = () => {
  const plans = [
    {
      name: 'Pay As You Go',
      badge: 'Standard',
      offPeak: '₹17.00 / kWh',
      peak: '₹23.50 / kWh',
      reservationFee: '₹25.00',
      featured: false
    },
    {
      name: 'EV Hub Basic',
      badge: 'Popular',
      offPeak: '₹15.50 / kWh',
      peak: '₹20.00 / kWh',
      reservationFee: '₹10.00',
      featured: false
    },
    {
      name: 'EV Hub Plus',
      badge: 'Best Value',
      offPeak: '₹13.50 / kWh',
      peak: '₹18.00 / kWh',
      reservationFee: '₹0.00',
      featured: true
    },
    {
      name: 'EV Hub Pro Fleet',
      badge: 'Enterprise',
      offPeak: '₹11.00 / kWh',
      peak: '₹15.00 / kWh',
      reservationFee: '₹0.00',
      featured: false
    }
  ];

  return (
    <div className="card-table-wrapper" style={{ marginTop: '2rem' }}>
      <div className="table-header-bar">
        <div>
          <h3 className="table-title">Network Charging Tariffs & Tier Plans</h3>
          <p className="text-muted text-xs mt-1">Transparent time-of-use rates, off-peak savings, and zero hidden reservation charges</p>
        </div>
        <span className="badge-pill active">Smart Grid Synchronized</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {plans.map((p) => (
          <div
            key={p.name}
            style={{
              background: p.featured ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,81,50,0.2))' : 'rgba(255,255,255,0.02)',
              border: p.featured ? '1px solid var(--primary-green)' : '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge-pill ${p.featured ? 'active' : 'pending'}`}>{p.badge}</span>
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h4>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted flex items-center gap-1"><Clock size={12} /> 12 AM - 5 AM:</span>
                  <span className="font-mono text-green font-bold">{p.offPeak}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted flex items-center gap-1"><Clock size={12} /> 12 PM - 4 PM:</span>
                  <span className="font-mono text-white font-bold">{p.peak}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                  <span className="text-muted">Slot Reservation:</span>
                  <span className="font-mono text-white">{p.reservationFee}</span>
                </div>
              </div>
            </div>

            <button
              className={p.featured ? 'btn-primary w-full text-xs' : 'btn-secondary w-full text-xs'}
              style={{ padding: '0.5rem' }}
            >
              Select Tariff
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TariffPlansCard;
