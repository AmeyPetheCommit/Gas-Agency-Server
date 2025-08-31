const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  consumerNumber: { type: String, unique: true },
  name: String,
  mobile: { type: String, default: '' },
  email: { type: String, unique: true },
  password: String,
  cylindersLeft: { type: Number, default: 12 },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastBooking: { type: Date },
  address: {
    apartment: { type: String, default: '' },
    building: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  lastReset: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
