const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { createAppointment, getUserAppointments } = require('../controllers/appointmentController');

router.post('/', verifyToken, createAppointment);
router.get('/', verifyToken, getUserAppointments);

module.exports = router;
