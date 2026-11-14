import React from 'react';
import { MapPin, Zap, Clock, DollarSign, ArrowRight } from 'lucide-react';
import ChargeArc from './ChargeArc';
import { Link } from 'react-router-dom';

const StationCard = ({ station, onSelect }) => {
  const availablePorts = parseInt(station.available_ports || 0, 10);
  const totalPorts = parseInt(station.total_ports || station.port_count || 1, 10);
  const isMaintenance = station.status === 'maintenance';
  const availabilityPercentage = Math.round((availablePorts / totalPorts) * 100);

  return (
    <div className={`station-card ${isMaintenance ? 'station-maintenance' : ''}`}>
      {/* Charge Arc Status Ring (Top-Right) */}
      <div className="charge-arc-status-ring">
        <ChargeArc
          percentage={isMaintenance ? 0 : availabilityPercentage}
          size="sm"
          label={`${isMaintenance ? '0' : availabilityPercentage}%`}
          animate={false}
        />
      </div>

      <div className="station-header">
        <div>
          <span className={`station-status-badge ${isMaintenance ? 'badge-maintenance' : 'badge-active'}`}>
            {isMaintenance ? 'Maintenance' : 'Active Station'}
          </span>
          <h3 className="station-name">{station.station_name}</h3>
        </div>
      </div>

      <div className="station-location">
        <MapPin size={16} className="text-muted" />
        <span>{station.location}</span>
      </div>

      <div className="station-metrics-grid">
        <div className="metric-box">
          <div className="metric-label">Ports Available</div>
          <div className="metric-val text-volt">
            {isMaintenance ? 0 : `${availablePorts} / ${totalPorts}`}
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Tariff Rate</div>
          <div className="metric-val">
            ₹{parseFloat(station.price_per_kwh || 0.30).toFixed(2)} <span className="unit">/ kWh</span>
          </div>
        </div>
      </div>

      <div className="station-footer">
        <div className="connector-tags">
          <span className="tag">CCS2</span>
          <span className="tag">Type 2</span>
        </div>

        <Link
          to={`/booking?stationId=${station.station_id}`}
          className={`btn-book-slot ${isMaintenance || availablePorts === 0 ? 'disabled' : ''}`}
        >
          <span>Book Slot</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default StationCard;
