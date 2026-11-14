const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  toggleStationStatus,
  setPortStatus,
  getUsers,
  deleteUser,
  getMaintenanceTickets
} = require('../controllers/adminController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

router.use(authenticateUser, requireAdmin);

router.get('/overview', getAdminOverview);
router.patch('/stations/:stationId/toggle-status', toggleStationStatus);
router.patch('/ports/:portId/status', setPortStatus);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/maintenance', getMaintenanceTickets);

module.exports = router;
