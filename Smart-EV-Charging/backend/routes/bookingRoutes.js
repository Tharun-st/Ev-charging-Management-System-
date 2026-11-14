const express = require('express');
const router = express.Router();
const { getBookings, createBooking, cancelBooking } = require('../controllers/bookingController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', getBookings);
router.post('/', createBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
