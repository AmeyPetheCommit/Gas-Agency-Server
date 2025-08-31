const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consumerNumber: { type: String, required: true },
  name: String,
  phone: String,
  preferredDate: Date,
  timeSlot: String,
  note: String,
  address: {
    apartment: String,
    building: String,
    street: String,
    city: String
  },
  status: {
  type: String,
  enum: ['Pending', 'Confirmed', 'Completed'],
  default: 'Pending'
}
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
