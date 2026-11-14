const express = require('express');
const router = express.Router();
const { getPayments, processPayment } = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', getPayments);
router.post('/process', processPayment);

module.exports = router;
