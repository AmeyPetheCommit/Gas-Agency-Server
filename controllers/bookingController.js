// controllers/bookingController.js
const Booking = require('../models/Booking');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createPDF(booking, user, otp, filePath, reminderDate) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text('Gas Booking Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Phone: ${user.mobile}`);
  doc.text(`Consumer Number: ${user.consumerNumber}`);
  doc.text(`Address: ${booking.address.apartment}, ${booking.address.building}, ${booking.address.street}, ${booking.address.city}`);
  doc.text(`Payment Mode: ${booking.paymentMode}`);
  doc.text(`Status: ${booking.status}`);
  doc.text(`Order Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Cylinder Price: ₹800`);
  doc.text(`Delivery Charge: ₹50`);
  doc.text(`Total: ₹850`);
  doc.moveDown();
  doc.text(`OTP for Delivery: ${otp}`);
  if (reminderDate) {
    doc.moveDown();
    doc.fillColor('red').text(`⏰ Reminder: Next refill suggested on ${reminderDate}`, { align: 'center' });
  }

  doc.end();
}

async function sendConfirmationEmail(user, booking, otp, reminderDate) {
  const pdfDir = path.join(__dirname, '../pdfs');
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
  const pdfPath = path.join(pdfDir, `${user.consumerNumber}_receipt.pdf`);

  createPDF(booking, user, otp, pdfPath, reminderDate);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const message = `Dear ${user.name},\n\nYour gas cylinder booking is confirmed.\n\nConsumer Number: ${user.consumerNumber}\nDelivery OTP: ${otp}` + (reminderDate ? `\nNext Refill Reminder: ${reminderDate}` : '') + `\n\nThank you!`;

  await transporter.sendMail({
    from: `"Gas Agency" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'Booking Confirmation with Reminder',
    text: message,
    attachments: [
      {
        filename: 'Gas_Booking_Receipt.pdf',
        path: pdfPath,
      },
    ],
  });

  fs.unlink(pdfPath, () => {});
}

exports.createBooking = async (req, res) => {
  try {
    const { apartment, building, street, city, phone, paymentMode } = req.body;

    const user = await User.findById(req.user._id);

    const newBooking = new Booking({
      userId: user._id,
      consumerNumber: user.consumerNumber,
      address: { apartment, building, street, city },
      phone,
      paymentMode,
      status: 'Pending',
      bookingDate: new Date()
    });

    await newBooking.save();

    user.address = { apartment, building, street, city };
    user.cylindersLeft -= 1;
    user.lastBooking = new Date();
    await user.save();

    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 25);
    const formattedReminder = reminderDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const otp = generateOTP();
    await sendConfirmationEmail(user, newBooking, otp, formattedReminder);

    res.json({ message: 'Cylinder booked successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
};



