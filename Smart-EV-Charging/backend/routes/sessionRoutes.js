const express = require('express');
const router = express.Router();
const { getSessions, startSession, stopSession } = require('../controllers/sessionController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', getSessions);
router.post('/start', startSession);
router.post('/:id/stop', stopSession);

module.exports = router;
