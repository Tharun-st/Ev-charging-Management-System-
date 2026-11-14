const { pool } = require('../config/db');

// Get all charging stations with port status summaries
const getAllStations = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.station_id,
        s.station_name,
        s.location,
        s.latitude,
        s.longitude,
        s.total_ports,
        s.status,
        s.price_per_kwh,
        s.created_at,
        COUNT(p.port_id) AS port_count,
        SUM(CASE WHEN p.status = 'available' THEN 1 ELSE 0 END) AS available_ports,
        SUM(CASE WHEN p.status = 'occupied' THEN 1 ELSE 0 END) AS occupied_ports,
        SUM(CASE WHEN p.status = 'reserved' THEN 1 ELSE 0 END) AS reserved_ports,
        SUM(CASE WHEN p.status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance_ports
      FROM CHARGING_STATIONS s
      LEFT JOIN CHARGING_PORTS p ON s.station_id = p.station_id
      GROUP BY s.station_id
      ORDER BY s.station_id ASC
    `;
    const [stations] = await pool.query(query);

    const enrichedStations = stations.map((s) => {
      const avail = parseInt(s.available_ports || 0, 10);
      const maint = parseInt(s.maintenance_ports || 0, 10);
      const total = parseInt(s.total_ports || 0, 10);
      const occ = parseInt(s.occupied_ports || 0, 10);
      const reserved = parseInt(s.reserved_ports || 0, 10);

      let occupancy_status = 'available';
      let status_label = `${avail}/${total} Available`;

      if (s.status === 'maintenance' || (total > 0 && maint === total)) {
        occupancy_status = 'maintenance';
        status_label = 'Under Maintenance';
      } else if (avail === 0) {
        occupancy_status = 'full';
        status_label = 'Full (All Ports Occupied)';
      } else if (occ > 0 || reserved > 0) {
        occupancy_status = 'occupied';
        status_label = `Occupied (${avail}/${total} Open)`;
      } else {
        occupancy_status = 'available';
        status_label = `Available (${avail}/${total} Open)`;
      }

      return {
        ...s,
        available_ports: avail,
        occupied_ports: occ,
        reserved_ports: reserved,
        maintenance_ports: maint,
        occupancy_status,
        status_label,
        is_full: occupancy_status === 'full',
        is_maintenance: occupancy_status === 'maintenance'
      };
    });

    return res.json({
      success: true,
      count: enrichedStations.length,
      data: enrichedStations
    });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch charging stations.',
      error: error.message
    });
  }
};

// Get single station with its ports
const getStationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [stationRows] = await pool.query(
      'SELECT * FROM CHARGING_STATIONS WHERE station_id = ?',
      [id]
    );

    if (stationRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Charging station not found.'
      });
    }

    const station = stationRows[0];

    const [ports] = await pool.query(
      'SELECT * FROM CHARGING_PORTS WHERE station_id = ? ORDER BY port_id ASC',
      [id]
    );

    station.ports = ports;

    return res.json({
      success: true,
      data: station
    });
  } catch (error) {
    console.error('Error fetching station details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch station details.',
      error: error.message
    });
  }
};

// Create a new charging station (Admin)
const createStation = async (req, res) => {
  try {
    const { station_name, location, latitude, longitude, total_ports, price_per_kwh, status, ports } = req.body;

    if (!station_name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Station name and location are required.'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO CHARGING_STATIONS 
       (station_name, location, latitude, longitude, total_ports, price_per_kwh, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        station_name,
        location,
        latitude || null,
        longitude || null,
        total_ports || 1,
        price_per_kwh || 0.30,
        status || 'active'
      ]
    );

    const stationId = result.insertId;

    // Add ports if provided
    if (ports && Array.isArray(ports) && ports.length > 0) {
      for (const p of ports) {
        await pool.query(
          `INSERT INTO CHARGING_PORTS (station_id, port_number, port_type, power_rating, status)
           VALUES (?, ?, ?, ?, ?)`,
          [
            stationId,
            p.port_number || `P-${Math.floor(100 + Math.random() * 900)}`,
            p.port_type || 'CCS2 Fast DC',
            p.power_rating || 150.00,
            p.status || 'available'
          ]
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Charging station created successfully!',
      station_id: stationId
    });
  } catch (error) {
    console.error('Error creating station:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create charging station.',
      error: error.message
    });
  }
};

// Update station
const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { station_name, location, latitude, longitude, total_ports, price_per_kwh, status } = req.body;

    await pool.query(
      `UPDATE CHARGING_STATIONS 
       SET station_name = COALESCE(?, station_name),
           location = COALESCE(?, location),
           latitude = COALESCE(?, latitude),
           longitude = COALESCE(?, longitude),
           total_ports = COALESCE(?, total_ports),
           price_per_kwh = COALESCE(?, price_per_kwh),
           status = COALESCE(?, status)
       WHERE station_id = ?`,
      [station_name, location, latitude, longitude, total_ports, price_per_kwh, status, id]
    );

    return res.json({
      success: true,
      message: 'Charging station updated successfully!'
    });
  } catch (error) {
    console.error('Error updating station:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update charging station.',
      error: error.message
    });
  }
};

// Update port status
const updatePortStatus = async (req, res) => {
  try {
    const { portId } = req.params;
    const { status } = req.body;

    if (!['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.'
      });
    }

    await pool.query('UPDATE CHARGING_PORTS SET status = ? WHERE port_id = ?', [status, portId]);

    return res.json({
      success: true,
      message: 'Port status updated successfully.'
    });
  } catch (error) {
    console.error('Error updating port status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update port status.',
      error: error.message
    });
  }
};

// Simulate state for testing and real-time automatic demonstration
const simulateStationState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body; // 'full' | 'maintenance' | 'occupied' | 'available'

    if (!['full', 'maintenance', 'occupied', 'available'].includes(state)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state. Must be full, maintenance, occupied, or available.'
      });
    }

    if (state === 'maintenance') {
      await pool.query('UPDATE CHARGING_STATIONS SET status = "maintenance" WHERE station_id = ?', [id]);
      await pool.query('UPDATE CHARGING_PORTS SET status = "maintenance" WHERE station_id = ?', [id]);
    } else if (state === 'full') {
      await pool.query('UPDATE CHARGING_STATIONS SET status = "active" WHERE station_id = ?', [id]);
      await pool.query('UPDATE CHARGING_PORTS SET status = "occupied" WHERE station_id = ?', [id]);
    } else if (state === 'occupied') {
      await pool.query('UPDATE CHARGING_STATIONS SET status = "active" WHERE station_id = ?', [id]);
      const [ports] = await pool.query('SELECT port_id FROM CHARGING_PORTS WHERE station_id = ? ORDER BY port_id ASC', [id]);
      if (ports.length > 0) {
        await pool.query('UPDATE CHARGING_PORTS SET status = "occupied" WHERE port_id = ?', [ports[0].port_id]);
        if (ports.length > 1) {
          await pool.query('UPDATE CHARGING_PORTS SET status = "available" WHERE station_id = ? AND port_id != ?', [id, ports[0].port_id]);
        }
      }
    } else if (state === 'available') {
      await pool.query('UPDATE CHARGING_STATIONS SET status = "active" WHERE station_id = ?', [id]);
      await pool.query('UPDATE CHARGING_PORTS SET status = "available" WHERE station_id = ?', [id]);
    }

    return res.json({
      success: true,
      message: `Station #${id} transitioned to state: ${state.toUpperCase()}`
    });
  } catch (error) {
    console.error('Error in simulateStationState:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to simulate station state.',
      error: error.message
    });
  }
};

// Cycle network tick: randomly toggle port states to simulate realistic live EV traffic
const simulateNetworkTick = async (req, res) => {
  try {
    const [stations] = await pool.query('SELECT station_id FROM CHARGING_STATIONS WHERE status != "maintenance" ORDER BY RAND() LIMIT 1');
    if (stations.length === 0) {
      return res.json({ success: true, message: 'No eligible stations.' });
    }
    const stationId = stations[0].station_id;
    const [ports] = await pool.query('SELECT port_id, status FROM CHARGING_PORTS WHERE station_id = ?', [stationId]);
    if (ports.length === 0) {
      return res.json({ success: true, message: 'No ports found.' });
    }

    const targetPort = ports[Math.floor(Math.random() * ports.length)];
    const nextStatus = targetPort.status === 'available' ? 'occupied' : 'available';
    await pool.query('UPDATE CHARGING_PORTS SET status = ? WHERE port_id = ?', [nextStatus, targetPort.port_id]);

    return res.json({
      success: true,
      station_id: stationId,
      port_id: targetPort.port_id,
      new_status: nextStatus,
      message: `Port #${targetPort.port_id} at Station #${stationId} transitioned to ${nextStatus.toUpperCase()}`
    });
  } catch (error) {
    console.error('Error in simulateNetworkTick:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  updatePortStatus,
  simulateStationState,
  simulateNetworkTick
};
