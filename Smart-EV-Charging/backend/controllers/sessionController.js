const { pool } = require('../config/db');

// Get charging sessions
const getSessions = async (req, res) => {
  try {
    let query = `
      SELECT 
        cs.session_id,
        cs.booking_id,
        cs.user_id,
        u.name AS user_name,
        cs.port_id,
        p.port_number,
        p.port_type,
        p.power_rating,
        s.station_id,
        s.station_name,
        s.location AS station_location,
        s.price_per_kwh,
        cs.vehicle_id,
        v.vehicle_model,
        v.license_plate,
        v.battery_capacity,
        cs.start_time,
        cs.end_time,
        cs.initial_battery_level,
        cs.final_battery_level,
        cs.status,
        ec.energy_consumed,
        ec.peak_power,
        ec.voltage,
        pm.amount AS total_cost,
        pm.payment_status,
        pm.payment_method
      FROM CHARGING_SESSION cs
      JOIN USERS u ON cs.user_id = u.user_id
      JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
      JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
      LEFT JOIN VEHICLES v ON cs.vehicle_id = v.vehicle_id
      LEFT JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
      LEFT JOIN PAYMENT pm ON cs.session_id = pm.session_id
    `;
    let params = [];

    if (req.user.role !== 'admin' || req.query.all !== 'true') {
      query += ' WHERE cs.user_id = ?';
      params.push(req.user.user_id);
    }

    query += ' ORDER BY cs.start_time DESC';

    const [sessions] = await pool.query(query, params);

    return res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching charging sessions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch charging sessions.',
      error: error.message
    });
  }
};

// Start a charging session
const startSession = async (req, res) => {
  try {
    const { booking_id, port_id, vehicle_id, initial_battery_level } = req.body;

    if (!port_id) {
      return res.status(400).json({
        success: false,
        message: 'Port ID is required to start a session.'
      });
    }

    // Verify port
    const [ports] = await pool.query('SELECT * FROM CHARGING_PORTS WHERE port_id = ?', [port_id]);
    if (ports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Charging port not found.'
      });
    }

    const port = ports[0];
    if (port.status === 'occupied' || port.status === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: `Port is currently ${port.status}.`
      });
    }

    const initBatt = initial_battery_level ? parseFloat(initial_battery_level) : 25.0;

    // Create session
    const [result] = await pool.query(
      `INSERT INTO CHARGING_SESSION 
       (booking_id, user_id, port_id, vehicle_id, start_time, initial_battery_level, status)
       VALUES (?, ?, ?, ?, NOW(), ?, 'in_progress')`,
      [booking_id || null, req.user.user_id, port_id, vehicle_id || null, initBatt]
    );

    const sessionId = result.insertId;

    // Mark port occupied
    await pool.query("UPDATE CHARGING_PORTS SET status = 'occupied' WHERE port_id = ?", [port_id]);

    // If linked to booking, mark booking in_progress/completed
    if (booking_id) {
      await pool.query("UPDATE BOOKING SET status = 'confirmed' WHERE booking_id = ?", [booking_id]);
    }

    return res.status(201).json({
      success: true,
      message: 'Charging session started successfully!',
      session_id: sessionId
    });
  } catch (error) {
    console.error('Error starting charging session:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to start charging session.',
      error: error.message
    });
  }
};

// Stop charging session
const stopSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { final_battery_level } = req.body;

    const [sessions] = await pool.query(
      `SELECT cs.*, p.station_id, p.power_rating, s.price_per_kwh, v.battery_capacity 
       FROM CHARGING_SESSION cs
       JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
       JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
       LEFT JOIN VEHICLES v ON cs.vehicle_id = v.vehicle_id
       WHERE cs.session_id = ?`,
      [id]
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Charging session not found.'
      });
    }

    const session = sessions[0];

    if (session.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to stop this session.'
      });
    }

    if (session.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: `Session is already ${session.status}.`
      });
    }

    const initialBatt = parseFloat(session.initial_battery_level) || 20.0;
    const finalBatt = final_battery_level ? parseFloat(final_battery_level) : Math.min(90.0, initialBatt + 55.0);
    const capacity = parseFloat(session.battery_capacity) || 60.0;

    // Calculate energy consumed in kWh — use 0 floor, not 5% minimum
    const battDiffPercent = Math.max(0, finalBatt - initialBatt);
    const energyConsumed = parseFloat(((battDiffPercent / 100) * capacity).toFixed(2));
    // Use at least 0.01 kWh so the DB record is valid, but never inflate billing
    const billableEnergy = Math.max(0.01, energyConsumed);
    const pricePerKwh = parseFloat(session.price_per_kwh) || 0.30;
    const totalAmount = parseFloat((billableEnergy * pricePerKwh).toFixed(2));


    // 1. Update session
    await pool.query(
      "UPDATE CHARGING_SESSION SET end_time = NOW(), final_battery_level = ?, status = 'completed' WHERE session_id = ?",
      [finalBatt, id]
    );

    // 2. Insert energy consumption
    const peakPower = Math.min(parseFloat(session.power_rating) || 120.0, 145.0);
    const voltage = 400.0;
    await pool.query(
      `INSERT INTO ENERGY_CONSUMPTION (session_id, energy_consumed, peak_power, voltage, recorded_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [id, billableEnergy, peakPower, voltage]
    );

    // 3. Create or update payment record
    const txnId = `TXN_${Date.now()}_${id}`;
    await pool.query(
      `INSERT INTO PAYMENT (user_id, session_id, booking_id, amount, payment_method, payment_status, transaction_id, payment_time)
       VALUES (?, ?, ?, ?, 'upi', 'completed', ?, NOW())`,
      [session.user_id, id, session.booking_id || null, totalAmount, txnId]
    );

    // 4. Free port
    await pool.query("UPDATE CHARGING_PORTS SET status = 'available' WHERE port_id = ?", [session.port_id]);

    return res.json({
      success: true,
      message: 'Charging session completed!',
      data: {
        session_id: id,
        initial_battery_level: initialBatt,
        final_battery_level: finalBatt,
        energy_consumed: energyConsumed,
        total_amount: totalAmount,
        transaction_id: txnId
      }
    });
  } catch (error) {
    console.error('Error stopping charging session:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to stop charging session.',
      error: error.message
    });
  }
};

module.exports = {
  getSessions,
  startSession,
  stopSession
};
