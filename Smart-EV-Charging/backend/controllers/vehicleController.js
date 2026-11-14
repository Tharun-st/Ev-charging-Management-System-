const { pool } = require('../config/db');

// Get all vehicles for authenticated user (or all if admin)
const getVehicles = async (req, res) => {
  try {
    let query = 'SELECT * FROM VEHICLES WHERE user_id = ? ORDER BY vehicle_id DESC';
    let params = [req.user.user_id];

    // If admin requests all
    if (req.user.role === 'admin' && req.query.all === 'true') {
      query = `
        SELECT v.*, u.name AS owner_name, u.email AS owner_email 
        FROM VEHICLES v 
        JOIN USERS u ON v.user_id = u.user_id 
        ORDER BY v.vehicle_id DESC
      `;
      params = [];
    }

    const [vehicles] = await pool.query(query, params);

    return res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles.',
      error: error.message
    });
  }
};

// Add new vehicle for authenticated user
const addVehicle = async (req, res) => {
  try {
    const { vehicle_model, license_plate, battery_capacity, port_type } = req.body;

    if (!vehicle_model || !license_plate || !battery_capacity || !port_type) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle model, license plate, battery capacity, and port type are required.'
      });
    }

    // Check unique license plate
    const [existing] = await pool.query('SELECT vehicle_id FROM VEHICLES WHERE license_plate = ?', [license_plate]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A vehicle with this license plate is already registered.'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO VEHICLES (user_id, vehicle_model, license_plate, battery_capacity, port_type) VALUES (?, ?, ?, ?, ?)',
      [req.user.user_id, vehicle_model, license_plate.toUpperCase().trim(), battery_capacity, port_type]
    );

    const newVehicle = {
      vehicle_id: result.insertId,
      user_id: req.user.user_id,
      vehicle_model,
      license_plate: license_plate.toUpperCase().trim(),
      battery_capacity,
      port_type
    };

    return res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully!',
      data: newVehicle
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add vehicle.',
      error: error.message
    });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const [rows] = await pool.query('SELECT * FROM VEHICLES WHERE vehicle_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.'
      });
    }

    if (rows[0].user_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this vehicle.'
      });
    }

    await pool.query('DELETE FROM VEHICLES WHERE vehicle_id = ?', [id]);

    return res.json({
      success: true,
      message: 'Vehicle deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle.',
      error: error.message
    });
  }
};

// Preset GPS waypoints & dynamic live simulation coordinates for vehicles across the Bay Area corridor
let liveFleetTelemetryState = {
  1: { lat: 37.7749, lng: -122.4194, battery: 68, status: 'charging', speed: 0, heading: 0, station_id: 1, current_power_kw: 142.5 },
  2: { lat: 37.3861, lng: -122.0839, battery: 74, status: 'charging', speed: 0, heading: 0, station_id: 2, current_power_kw: 148.0 },
  3: { lat: 37.5485, lng: -122.3130, battery: 45, status: 'en_route', speed: 52, heading: 320, station_id: 3, current_power_kw: 0 },
  4: { lat: 37.6213, lng: -122.3790, battery: 88, status: 'idle', speed: 0, heading: 90, station_id: 6, current_power_kw: 0 },
  5: { lat: 37.8044, lng: -122.2712, battery: 32, status: 'en_route', speed: 38, heading: 140, station_id: 8, current_power_kw: 0 },
  6: { lat: 37.4220, lng: -122.1810, battery: 82, status: 'charging', speed: 0, heading: 0, station_id: 5, current_power_kw: 320.0 },
  7: { lat: 37.4098, lng: -122.1465, battery: 58, status: 'idle', speed: 0, heading: 180, station_id: 9, current_power_kw: 0 },
  8: { lat: 37.8010, lng: -122.4580, battery: 91, status: 'charging', speed: 0, heading: 0, station_id: 7, current_power_kw: 150.0 },
  9: { lat: 37.3318, lng: -121.8906, battery: 74, status: 'idle', speed: 0, heading: 45, station_id: 10, current_power_kw: 0 },
  10: { lat: 37.4852, lng: -122.2364, battery: 60, status: 'en_route', speed: 64, heading: 155, station_id: 5, current_power_kw: 0 },
  11: { lat: 37.8055, lng: -122.4410, battery: 28, status: 'charging', speed: 0, heading: 0, station_id: 11, current_power_kw: 135.0 },
  12: { lat: 38.2975, lng: -122.2869, battery: 79, status: 'idle', speed: 0, heading: 270, station_id: 12, current_power_kw: 0 }
};

// Advance coordinates slightly along heading for vehicles on the road
const advanceVehiclePosition = (vState) => {
  if (vState.status === 'en_route') {
    const rad = (vState.heading * Math.PI) / 180;
    // ~0.001 deg is approx 100 meters
    const deltaLat = Math.cos(rad) * 0.0006;
    const deltaLng = Math.sin(rad) * 0.0006;
    vState.lat = parseFloat((vState.lat + deltaLat).toFixed(6));
    vState.lng = parseFloat((vState.lng + deltaLng).toFixed(6));
    
    // Bounds check within SF Bay corridor: bounce heading if moving too far
    if (vState.lat > 38.35 || vState.lat < 37.25 || vState.lng > -121.75 || vState.lng < -122.55) {
      vState.heading = (vState.heading + 180) % 360;
    }
    
    // Slight battery burn
    if (Math.random() > 0.6 && vState.battery > 12) {
      vState.battery = Math.max(10, vState.battery - 1);
    }
  } else if (vState.status === 'charging') {
    // Battery slowly charges up to 98%
    if (Math.random() > 0.5 && vState.battery < 98) {
      vState.battery = Math.min(98, vState.battery + 1);
    }
  }
};

// Get Real-Time Fleet Telemetry
const getFleetTelemetry = async (req, res) => {
  try {
    const [vehicles] = await pool.query(`
      SELECT 
        v.vehicle_id,
        v.user_id,
        v.vehicle_model,
        v.license_plate,
        v.battery_capacity,
        v.port_type,
        v.created_at,
        u.name AS driver_name,
        u.email AS driver_email,
        u.phone AS driver_phone
      FROM VEHICLES v
      JOIN USERS u ON v.user_id = u.user_id
      ORDER BY v.vehicle_id ASC
    `);

    // Fetch active sessions from database to enrich real-time charging status
    const [activeSessions] = await pool.query(`
      SELECT 
        cs.session_id,
        cs.vehicle_id,
        cs.user_id,
        cs.port_id,
        cs.start_time,
        cs.initial_battery_level,
        p.port_number,
        p.port_type AS station_port_type,
        p.power_rating,
        s.station_id,
        s.station_name,
        s.location AS station_location,
        s.price_per_kwh
      FROM CHARGING_SESSION cs
      JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
      JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
      WHERE cs.status = 'in_progress'
    `);

    const sessionMap = new Map();
    activeSessions.forEach((s) => {
      if (s.vehicle_id) sessionMap.set(s.vehicle_id, s);
    });

    const fleet = vehicles.map((v) => {
      if (!liveFleetTelemetryState[v.vehicle_id]) {
        liveFleetTelemetryState[v.vehicle_id] = {
          lat: 37.7749 + (Math.random() - 0.5) * 0.3,
          lng: -122.4194 + (Math.random() - 0.5) * 0.3,
          battery: Math.floor(Math.random() * 50) + 35,
          status: 'idle',
          speed: 0,
          heading: Math.floor(Math.random() * 360),
          station_id: null,
          current_power_kw: 0
        };
      }

      const vState = liveFleetTelemetryState[v.vehicle_id];
      advanceVehiclePosition(vState);

      const activeSession = sessionMap.get(v.vehicle_id);

      const status = activeSession ? 'charging' : vState.status;
      const powerKw = activeSession ? parseFloat(activeSession.power_rating) : vState.current_power_kw;

      return {
        ...v,
        latitude: vState.lat,
        longitude: vState.lng,
        battery_level: vState.battery,
        status: status,
        speed_mph: status === 'en_route' ? vState.speed : 0,
        heading_deg: vState.heading,
        current_power_kw: powerKw,
        assigned_station: activeSession ? {
          station_id: activeSession.station_id,
          station_name: activeSession.station_name,
          station_location: activeSession.station_location,
          port_number: activeSession.port_number,
          start_time: activeSession.start_time
        } : (vState.station_id ? { station_id: vState.station_id } : null)
      };
    });

    const summary = {
      total_fleet: fleet.length,
      charging_now: fleet.filter(f => f.status === 'charging').length,
      en_route: fleet.filter(f => f.status === 'en_route').length,
      idle: fleet.filter(f => f.status === 'idle').length,
      avg_battery_percent: Math.round(fleet.reduce((acc, curr) => acc + curr.battery_level, 0) / (fleet.length || 1)),
      total_power_draw_kw: fleet.reduce((acc, curr) => acc + (curr.current_power_kw || 0), 0)
    };

    return res.json({
      success: true,
      summary,
      count: fleet.length,
      data: fleet
    });
  } catch (error) {
    console.error('Error fetching fleet telemetry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch fleet telemetry.',
      error: error.message
    });
  }
};

module.exports = {
  getVehicles,
  addVehicle,
  deleteVehicle,
  getFleetTelemetry
};
