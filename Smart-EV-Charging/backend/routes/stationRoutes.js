const express = require('express');
const router = express.Router();
const {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  updatePortStatus,
  simulateStationState,
  simulateNetworkTick
} = require('../controllers/stationController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Public access
router.get('/', getAllStations);
router.post('/simulate-tick', simulateNetworkTick);

// Admin restricted — register BEFORE /:id to avoid route conflict
router.post('/', authenticateUser, requireAdmin, createStation);
router.patch('/ports/:portId/status', authenticateUser, requireAdmin, updatePortStatus);
router.post('/:id/simulate-state', simulateStationState);

// Dynamic param routes last
router.get('/:id', getStationById);
router.put('/:id', authenticateUser, requireAdmin, updateStation);

module.exports = router;

