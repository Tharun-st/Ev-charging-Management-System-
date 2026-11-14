import React from 'react';
import { Car, BatteryCharging, Trash2, PlugZap } from 'lucide-react';

const VehicleCard = ({ vehicle, onDelete }) => {
  return (
    <div className="vehicle-card">
      <div className="vehicle-card-top">
        <div className="vehicle-icon-box">
          <Car size={24} className="text-cyan" />
        </div>
        <button
          onClick={() => onDelete && onDelete(vehicle.vehicle_id)}
          className="btn-icon-danger"
          title="Delete Vehicle"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="vehicle-title">{vehicle.vehicle_model}</h3>
      <div className="vehicle-plate">{vehicle.license_plate}</div>

      <div className="vehicle-specs-grid">
        <div className="spec-item">
          <BatteryCharging size={16} className="text-emerald" />
          <div>
            <div className="spec-label">Battery Pack</div>
            <div className="spec-value">{vehicle.battery_capacity} <span className="text-xs">kWh</span></div>
          </div>
        </div>

        <div className="spec-item">
          <PlugZap size={16} className="text-cyan" />
          <div>
            <div className="spec-label">Connector Port</div>
            <div className="spec-value">{vehicle.port_type}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
