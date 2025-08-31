const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { getUserBookings, createBooking } = require('../controllers/bookingController');

router.get('/', verifyToken, getUserBookings); 
router.post('/', verifyToken, createBooking);

module.exports = router;
