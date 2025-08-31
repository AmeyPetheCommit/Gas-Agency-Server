const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// 👇 make sure all these are real functions
const {
  getAllBookings,
  updateBookingStatus,
  getAllAppointments,
  updateAppointmentStatus,
  getAllUsers
} = require('../controllers/adminController');

// 👇 Routes
router.get('/bookings', verifyToken, verifyAdmin, getAllBookings);
router.put('/bookings/:id', verifyToken, verifyAdmin, updateBookingStatus);

router.get('/appointments', verifyToken, verifyAdmin, getAllAppointments);
router.put('/appointments/:id', verifyToken, verifyAdmin, updateAppointmentStatus);

router.get('/users', verifyToken, verifyAdmin, getAllUsers);

module.exports = router;
