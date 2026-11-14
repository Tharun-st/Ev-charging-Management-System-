const { pool } = require('../config/db');

// Get high-level network management overview
const getAdminOverview = async (req, res) => {
  try {
    const [usersCount] = await pool.query('SELECT COUNT(*) AS total FROM USERS WHERE role = "user"');
    const [stationsCount] = await pool.query('SELECT COUNT(*) AS total, SUM(CASE WHEN status="active" THEN 1 ELSE 0 END) AS active FROM CHARGING_STATIONS');
    const [portsCount] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) AS occupied,
        SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) AS reserved,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance
      FROM CHARGING_PORTS
    `);
    const [energyCount] = await pool.query('SELECT COALESCE(SUM(energy_consumed), 0) AS total, COALESCE(MAX(peak_power), 0) AS peak FROM ENERGY_CONSUMPTION');
    const [revenueCount] = await pool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM PAYMENT WHERE payment_status = "completed"');
    const [activeSessions] = await pool.query('SELECT COUNT(*) AS total FROM CHARGING_SESSION WHERE status = "in_progress"');
    const [bookingsCount] = await pool.query('SELECT COUNT(*) AS total FROM BOOKING WHERE status = "confirmed"');

    // Station list with all live ports
    const [stations] = await pool.query(`
      SELECT 
        s.*,
        COUNT(p.port_id) AS total_ports_count,
        SUM(CASE WHEN p.status = 'available' THEN 1 ELSE 0 END) AS available_ports,
        SUM(CASE WHEN p.status = 'occupied' THEN 1 ELSE 0 END) AS occupied_ports,
        SUM(CASE WHEN p.status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance_ports
      FROM CHARGING_STATIONS s
      LEFT JOIN CHARGING_PORTS p ON s.station_id = p.station_id
      GROUP BY s.station_id
      ORDER BY s.station_id ASC
    `);

    // Fetch all ports for detailed admin management
    const [ports] = await pool.query(`
      SELECT p.*, s.station_name 
      FROM CHARGING_PORTS p 
      JOIN CHARGING_STATIONS s ON p.station_id = s.station_id 
      ORDER BY p.station_id, p.port_id
    `);

    // Calculate grid load utilization percentage
    const totalPorts = portsCount[0].total || 1;
    const busyPorts = (portsCount[0].occupied || 0) + (portsCount[0].reserved || 0);
    const utilizationRate = parseFloat(((busyPorts / totalPorts) * 100).toFixed(1));

    return res.json({
      success: true,
      data: {
        total_drivers: usersCount[0].total,
        stations_summary: stationsCount[0],
        ports_summary: portsCount[0],
        total_energy_kwh: energyCount[0].total,
        peak_grid_load_kw: energyCount[0].peak,
        total_revenue_usd: revenueCount[0].total,
        active_sessions_count: activeSessions[0].total,
        confirmed_bookings_count: bookingsCount[0].total,
        utilization_rate: utilizationRate,
        stations,
        ports
      }
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin overview data',
      error: error.message
    });
  }
};

// Toggle station active / maintenance
const toggleStationStatus = async (req, res) => {
  try {
    const { stationId } = req.params;
    const [stations] = await pool.query('SELECT status FROM CHARGING_STATIONS WHERE station_id = ?', [stationId]);
    if (stations.length === 0) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    const currentStatus = stations[0].status;
    const nextStatus = currentStatus === 'active' ? 'maintenance' : 'active';

    await pool.query('UPDATE CHARGING_STATIONS SET status = ? WHERE station_id = ?', [nextStatus, stationId]);

    return res.json({
      success: true,
      message: `Station status updated to ${nextStatus}`,
      status: nextStatus
    });
  } catch (error) {
    console.error('Toggle station status error:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle station status', error: error.message });
  }
};

// Set port status
const setPortStatus = async (req, res) => {
  try {
    const { portId } = req.params;
    const { status } = req.body;

    if (!['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await pool.query('UPDATE CHARGING_PORTS SET status = ? WHERE port_id = ?', [status, portId]);

    return res.json({
      success: true,
      message: `Port status set to ${status}`
    });
  } catch (error) {
    console.error('Set port status error:', error);
    return res.status(500).json({ success: false, message: 'Failed to set port status', error: error.message });
  }
};

// Get all registered users with vehicle count & spend
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.created_at,
        COUNT(DISTINCT v.vehicle_id) AS vehicles_count,
        COALESCE(SUM(pm.amount), 0) AS total_spent
      FROM USERS u
      LEFT JOIN VEHICLES v ON u.user_id = v.user_id
      LEFT JOIN PAYMENT pm ON u.user_id = pm.user_id AND pm.payment_status = 'completed'
      GROUP BY u.user_id
      ORDER BY u.user_id DESC
    `);
    return res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error('Admin getUsers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: err.message });
  }
};

// Delete user (admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id, 10) === req.user.user_id) {
      return res.status(400).json({ success: false, message: 'Cannot delete current logged-in admin account' });
    }
    await pool.query('DELETE FROM USERS WHERE user_id = ?', [id]);
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin deleteUser error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
};

// Get maintenance status & offline assets
const getMaintenanceTickets = async (req, res) => {
  try {
    const [maintPorts] = await pool.query(`
      SELECT 
        p.port_id,
        p.port_number,
        p.port_type,
        p.power_rating,
        p.status,
        s.station_id,
        s.station_name,
        s.location,
        s.status AS station_status
      FROM CHARGING_PORTS p
      JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
      WHERE p.status = 'maintenance' OR s.status = 'maintenance'
      ORDER BY s.station_id ASC
    `);
    return res.json({ success: true, count: maintPorts.length, data: maintPorts });
  } catch (err) {
    console.error('Admin getMaintenanceTickets error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch maintenance data', error: err.message });
  }
};

module.exports = {
  getAdminOverview,
  toggleStationStatus,
  setPortStatus,
  getUsers,
  deleteUser,
  getMaintenanceTickets
};
