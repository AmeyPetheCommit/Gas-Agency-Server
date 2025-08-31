// models/Notice.js
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: { type: String, enum: ['general', 'urgent', 'info'], default: 'general' },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // ✅ track users who viewed
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
