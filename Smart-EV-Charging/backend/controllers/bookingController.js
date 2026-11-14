const { pool } = require('../config/db');

// Get bookings
const getBookings = async (req, res) => {
  try {
    let query = `
      SELECT 
        b.booking_id,
        b.user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        b.station_id,
        s.station_name,
        s.location AS station_location,
        s.price_per_kwh,
        b.port_id,
        p.port_number,
        p.port_type,
        b.vehicle_id,
        v.vehicle_model,
        v.license_plate,
        b.booking_time,
        b.start_time,
        b.end_time,
        b.status,
        b.created_at
      FROM BOOKING b
      JOIN USERS u ON b.user_id = u.user_id
      JOIN CHARGING_STATIONS s ON b.station_id = s.station_id
      JOIN CHARGING_PORTS p ON b.port_id = p.port_id
      LEFT JOIN VEHICLES v ON b.vehicle_id = v.vehicle_id
    `;
    let params = [];

    if (req.user.role !== 'admin' || req.query.all !== 'true') {
      query += ' WHERE b.user_id = ?';
      params.push(req.user.user_id);
    }

    query += ' ORDER BY b.start_time DESC';

    const [bookings] = await pool.query(query, params);

    return res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings.',
      error: error.message
    });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { station_id, port_id, vehicle_id, start_time, end_time } = req.body;

    if (!station_id || !port_id || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Station, Port, Start Time, and End Time are required.'
      });
    }

    // Check port existence and active state
    const [ports] = await pool.query(
      'SELECT port_id, station_id, status FROM CHARGING_PORTS WHERE port_id = ? AND station_id = ?',
      [port_id, station_id]
    );

    if (ports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected charging port does not exist at this station.'
      });
    }

    // Check overlapping bookings on the same port
    const [overlap] = await pool.query(
      `SELECT booking_id FROM BOOKING 
       WHERE port_id = ? 
       AND status IN ('confirmed', 'pending')
       AND NOT (end_time <= ? OR start_time >= ?)`,
      [port_id, start_time, end_time]
    );

    if (overlap.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This charging port is already booked for the selected time slot.'
      });
    }

    // Insert booking
    const [result] = await pool.query(
      `INSERT INTO BOOKING (user_id, station_id, port_id, vehicle_id, booking_time, start_time, end_time, status)
       VALUES (?, ?, ?, ?, NOW(), ?, ?, 'confirmed')`,
      [req.user.user_id, station_id, port_id, vehicle_id || null, start_time, end_time]
    );

    // Update port status to reserved if slot is current/near
    await pool.query(
      "UPDATE CHARGING_PORTS SET status = 'reserved' WHERE port_id = ? AND status = 'available'",
      [port_id]
    );

    return res.status(201).json({
      success: true,
      message: 'Charging slot booked successfully!',
      booking_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking.',
      error: error.message
    });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.query('SELECT * FROM BOOKING WHERE booking_id = ?', [id]);
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    const booking = bookings[0];
    if (booking.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking.'
      });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled because it is already ${booking.status}.`
      });
    }

    // Update booking status
    await pool.query("UPDATE BOOKING SET status = 'cancelled' WHERE booking_id = ?", [id]);

    // Free port if reserved
    await pool.query(
      "UPDATE CHARGING_PORTS SET status = 'available' WHERE port_id = ? AND status = 'reserved'",
      [booking.port_id]
    );

    return res.json({
      success: true,
      message: 'Booking cancelled successfully.'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking.',
      error: error.message
    });
  }
};

module.exports = {
  getBookings,
  createBooking,
  cancelBooking
};
