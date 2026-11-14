const express = require('express');
const router = express.Router();
const { getVehicles, addVehicle, deleteVehicle, getFleetTelemetry } = require('../controllers/vehicleController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public fleet telemetry for live map
router.get('/fleet', getFleetTelemetry);

// Authenticated user operations
router.use(authenticateUser);

router.get('/', getVehicles);
router.post('/', addVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
