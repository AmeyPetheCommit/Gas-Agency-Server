const Booking = require('../models/Booking');
const Appointment = require('../models/Appointment');

const User = require('../models/User');


// ✅ View all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .populate('userId', 'name'); // 👈 populate user's name
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// ✅ Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = req.body.status || booking.status;
    await booking.save();

    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// ✅ View all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
    .sort({ date: -1 })
    .populate('userId', 'name');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// ✅ Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    appointment.status = req.body.status || appointment.status;
    await appointment.save();

    res.json({ message: 'Appointment status updated', appointment });
  } catch (err) {
    console.error('Update appointment error:', err); // ✅ Add this
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};



// ✅ View all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({isAdmin: false}).sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
