const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Middleware to authenticate JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smart_ev_charging_super_secret_jwt_key_2026');

    // Fetch user details from DB
    const [rows] = await pool.query(
      'SELECT user_id, name, email, phone, role FROM USERS WHERE user_id = ?',
      [decoded.user_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user not found.'
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

// Middleware to restrict access to admin users
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. Administrator privileges required.'
    });
  }
};

module.exports = {
  authenticateUser,
  requireAdmin
};
