const { pool } = require('../config/db');

// Get energy stats and analytics
const getEnergyStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const isAdmin = req.user.role === 'admin';

    // Summary totals
    let totalsQuery = `
      SELECT 
        COUNT(DISTINCT ec.consumption_id) AS total_readings,
        COALESCE(SUM(ec.energy_consumed), 0) AS total_energy_kwh,
        COALESCE(MAX(ec.peak_power), 0) AS max_peak_power,
        COALESCE(AVG(ec.voltage), 400.0) AS avg_voltage
      FROM ENERGY_CONSUMPTION ec
      JOIN CHARGING_SESSION cs ON ec.session_id = cs.session_id
    `;
    let totalsParams = [];

    if (!isAdmin || req.query.all !== 'true') {
      totalsQuery += ' WHERE cs.user_id = ?';
      totalsParams.push(userId);
    }

    const [totals] = await pool.query(totalsQuery, totalsParams);

    // Station-wise consumption
    const [stationBreakdown] = await pool.query(`
      SELECT 
        s.station_id,
        s.station_name,
        s.location,
        COUNT(DISTINCT cs.session_id) AS session_count,
        COALESCE(SUM(ec.energy_consumed), 0) AS total_kwh,
        COALESCE(AVG(ec.peak_power), 0) AS avg_peak_power
      FROM CHARGING_STATIONS s
      LEFT JOIN CHARGING_PORTS p ON s.station_id = p.station_id
      LEFT JOIN CHARGING_SESSION cs ON p.port_id = cs.port_id
      LEFT JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
      GROUP BY s.station_id, s.station_name, s.location
      ORDER BY total_kwh DESC
    `);

    // Recent telemetry records
    let recentQuery = `
      SELECT 
        ec.consumption_id,
        ec.session_id,
        ec.energy_consumed,
        ec.peak_power,
        ec.voltage,
        ec.recorded_at,
        s.station_name,
        p.port_number,
        u.name AS user_name
      FROM ENERGY_CONSUMPTION ec
      JOIN CHARGING_SESSION cs ON ec.session_id = cs.session_id
      JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
      JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
      JOIN USERS u ON cs.user_id = u.user_id
    `;
    let recentParams = [];

    if (!isAdmin || req.query.all !== 'true') {
      recentQuery += ' WHERE cs.user_id = ?';
      recentParams.push(userId);
    }

    recentQuery += ' ORDER BY ec.recorded_at DESC LIMIT 15';

    const [recentLogs] = await pool.query(recentQuery, recentParams);

    return res.json({
      success: true,
      data: {
        summary: totals[0],
        stationBreakdown,
        recentLogs
      }
    });
  } catch (error) {
    console.error('Error fetching energy stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch energy analytics.',
      error: error.message
    });
  }
};

// Get single session energy
const getSessionEnergy = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM ENERGY_CONSUMPTION WHERE session_id = ? ORDER BY recorded_at DESC',
      [sessionId]
    );

    return res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching session energy:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch session energy.',
      error: error.message
    });
  }
};

module.exports = {
  getEnergyStats,
  getSessionEnergy
};
