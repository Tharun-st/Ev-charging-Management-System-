const express = require('express');
const router = express.Router();
const { getEnergyStats, getSessionEnergy } = require('../controllers/energyController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/stats', getEnergyStats);
router.get('/session/:sessionId', getSessionEnergy);

module.exports = router;
