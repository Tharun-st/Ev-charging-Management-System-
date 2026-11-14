import React, { useState } from 'react';
import { initialStations } from '../services/mockData';
import { Link } from 'react-router-dom';
import { MapPin, Search, Filter, Zap, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

const Stations = () => {
  const [stations] = useState(initialStations);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [chargerTypeFilter, setChargerTypeFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  // Extract distinct locations for filter dropdown
  const locations = ['All', 'Bengaluru', 'Chennai', 'Coimbatore', 'Salem', 'Hosur', 'Madurai'];
  const chargerTypes = ['All', 'CCS2', 'Type 2', 'CHAdeMO', 'Bharat DC-001'];

  const filteredStations = stations.filter((st) => {
    // 1. Search Query
    const matchSearch = 
      st.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.location.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Location Filter
    const matchLocation = locationFilter === 'All' || st.location.toLowerCase().includes(locationFilter.toLowerCase());

    // 3. Charger Type Filter
    const matchType = chargerTypeFilter === 'All' || st.charger_type.toLowerCase().includes(chargerTypeFilter.toLowerCase());

    // 4. Availability Filter
    const matchAvailability = 
      availabilityFilter === 'All' ||
      (availabilityFilter === 'Available' && st.available_ports > 0 && st.status === 'Active') ||
      (availabilityFilter === 'Full' && st.available_ports === 0 && st.status === 'Active') ||
      (availabilityFilter === 'Maintenance' && st.status === 'Maintenance');

    return matchSearch && matchLocation && matchType && matchAvailability;
  });

  return (
    <div className="stations-page-container">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Charging Stations</h1>
          <p className="welcome-sub">Explore active EV hubs across Bengaluru, Tamil Nadu & regional corridors</p>
        </div>
        <Link to="/fleet-map" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={17} />
          <span>Open Live Fleet Map</span>
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="card-table-wrapper" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search */}
          <div className="navbar-search-box" style={{ width: '100%' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search station or city (e.g. Bengaluru, OMR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Location Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              className="form-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="All">All Locations (South India)</option>
              {locations.filter(l => l !== 'All').map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Charger Type Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              className="form-select"
              value={chargerTypeFilter}
              onChange={(e) => setChargerTypeFilter(e.target.value)}
            >
              <option value="All">All Charger Types</option>
              <option value="CCS2">CCS2 Fast DC</option>
              <option value="Type 2">Type 2 AC</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              className="form-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Ports Only</option>
              <option value="Full">Occupied / Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Station Cards Grid */}
      <div className="stats-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredStations.map((st) => {
          const isMaintenance = st.status === 'Maintenance';
          return (
            <div key={st.station_id} className="stat-card" style={{ flexDirection: 'column', gap: '1.25rem' }}>
              {/* Top: Name & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                <div>
                  <span className={`badge-pill ${isMaintenance ? 'maintenance' : 'active'}`} style={{ marginBottom: '0.5rem' }}>
                    {st.status}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>{st.station_name}</h3>
                  <div className="text-xs text-muted flex items-center gap-1 mt-1">
                    <MapPin size={13} className="text-green" /> {st.location}
                  </div>
                </div>
              </div>

              {/* Station Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px' }}>
                <div>
                  <div className="info-label">Available Ports</div>
                  <div className="info-val text-green font-mono">
                    {isMaintenance ? 0 : st.available_ports} <span className="text-xs text-muted">/ {st.total_ports} Total</span>
                  </div>
                </div>

                <div>
                  <div className="info-label">Tariff Rate</div>
                  <div className="info-val font-mono">
                    ₹{st.price_per_kwh.toFixed(2)} <span className="text-xs text-muted">/ kWh</span>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div className="info-label">Charger Type</div>
                  <div className="text-xs text-body font-mono">{st.charger_type}</div>
                </div>
              </div>

              {/* Book Now & View on Map Buttons */}
              <div style={{ width: '100%', marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                <Link
                  to={`/booking?stationId=${st.station_id}`}
                  className={`btn-primary ${isMaintenance || st.available_ports === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                  style={{ justifyContent: 'center' }}
                >
                  <span>{isMaintenance ? 'Under Maintenance' : st.available_ports === 0 ? 'Station Full' : 'Book Now'}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/fleet-map"
                  className="btn-secondary"
                  title="Locate on Live Fleet Map"
                  style={{ padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <MapPin size={16} className="text-green" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stations;
