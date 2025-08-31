const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  consumerNumber: { type: String, required: true },
  address: {
    apartment: String,
    building: String,
    street: String,
    city: String,
  },
  phone: String,
  paymentMode: { type: String, enum: ['COD', 'Paytm'], default: 'COD' },
  bookingDate: { type: Date, default: Date.now },
  status: { 
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'}
});

module.exports = mongoose.model('Booking', bookingSchema);

