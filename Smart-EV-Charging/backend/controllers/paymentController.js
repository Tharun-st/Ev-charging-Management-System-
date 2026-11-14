const { pool } = require('../config/db');

// Get payments
const getPayments = async (req, res) => {
  try {
    let query = `
      SELECT 
        pm.payment_id,
        pm.user_id,
        u.name AS user_name,
        u.email AS user_email,
        pm.session_id,
        pm.booking_id,
        pm.amount,
        pm.payment_method,
        pm.payment_status,
        pm.transaction_id,
        pm.payment_time,
        s.station_name
      FROM PAYMENT pm
      JOIN USERS u ON pm.user_id = u.user_id
      LEFT JOIN CHARGING_SESSION cs ON pm.session_id = cs.session_id
      LEFT JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
      LEFT JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
    `;
    let params = [];

    if (req.user.role !== 'admin' || req.query.all !== 'true') {
      query += ' WHERE pm.user_id = ?';
      params.push(req.user.user_id);
    }

    query += ' ORDER BY pm.payment_time DESC';

    const [payments] = await pool.query(query, params);

    return res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment records.',
      error: error.message
    });
  }
};

// Process / Create new payment
const processPayment = async (req, res) => {
  try {
    const { session_id, booking_id, amount, payment_method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required.'
      });
    }

    const method = payment_method || 'upi';
    const txnId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const [result] = await pool.query(
      `INSERT INTO PAYMENT 
       (user_id, session_id, booking_id, amount, payment_method, payment_status, transaction_id, payment_time)
       VALUES (?, ?, ?, ?, ?, 'completed', ?, NOW())`,
      [req.user.user_id, session_id || null, booking_id || null, amount, method, txnId]
    );

    return res.status(201).json({
      success: true,
      message: 'Payment processed successfully!',
      data: {
        payment_id: result.insertId,
        amount,
        payment_method: method,
        payment_status: 'completed',
        transaction_id: txnId
      }
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process payment.',
      error: error.message
    });
  }
};

module.exports = {
  getPayments,
  processPayment
};
