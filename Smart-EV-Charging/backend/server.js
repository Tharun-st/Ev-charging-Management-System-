const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, testConnection } = require('./config/db');

const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — restrict to frontend origin
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, curl) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const energyRoutes = require('./routes/energyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Dashboard Aggregated Overview Endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [stationsCount] = await pool.query('SELECT COUNT(*) AS total FROM CHARGING_STATIONS WHERE status = "active"');
    const [portsCount] = await pool.query('SELECT COUNT(*) AS total FROM CHARGING_PORTS WHERE status = "available"');
    const [activeSessions] = await pool.query('SELECT COUNT(*) AS total FROM CHARGING_SESSION WHERE status = "in_progress"');
    const [totalEnergy] = await pool.query('SELECT COALESCE(SUM(energy_consumed), 0) AS total FROM ENERGY_CONSUMPTION');
    const [totalRevenue] = await pool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM PAYMENT WHERE payment_status = "completed"');
    const [recentSessions] = await pool.query(`
      SELECT cs.session_id, u.name AS user_name, v.vehicle_model, s.station_name, p.port_number, cs.start_time, cs.status, cs.initial_battery_level, cs.final_battery_level
      FROM CHARGING_SESSION cs
      JOIN USERS u ON cs.user_id = u.user_id
      JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
      JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
      LEFT JOIN VEHICLES v ON cs.vehicle_id = v.vehicle_id
      ORDER BY cs.start_time DESC LIMIT 5
    `);

    return res.json({
      success: true,
      data: {
        active_stations: stationsCount[0].total,
        available_ports: portsCount[0].total,
        active_sessions: activeSessions[0].total,
        total_energy_kwh: totalEnergy[0].total,
        total_revenue_usd: totalRevenue[0].total,
        recent_sessions: recentSessions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    name: 'Smart EV Charging Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Smart EV Charging Backend running on port ${PORT}`);
  await testConnection();
});
