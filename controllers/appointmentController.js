const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.createAppointment = async (req, res) => {
  try {
    const { date, time, note } = req.body; // Make sure these match what frontend sends

    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const appointment = new Appointment({
      userId: user._id,
      consumerNumber: user.consumerNumber,
      name: user.name,
      phone: user.mobile,
      preferredDate: new Date(date),
      timeSlot: time,
      note: note || '',
      address: user.address,
      status: 'Pending'
    });

    await appointment.save();

    res.status(201).json({ message: 'Appointment booked successfully!' });
  } catch (err) {
    console.error('Appointment Error:', err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).sort({ preferredDate: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
