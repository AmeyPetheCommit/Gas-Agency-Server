const Notice = require('../models/Notice');

// ✅ Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notice = new Notice({ title, message, type });
    await notice.save();
    res.json({ message: 'Notice created successfully', notice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
};

// ✅ Get all notices (for users & admin dashboard)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

// ✅ Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};

// ✅ Get count of unviewed notices for a user
exports.getUnviewedNoticesCount = async (req, res) => {
  try {
    const count = await Notice.countDocuments({
      viewedBy: { $ne: req.user._id }   // not in viewedBy array
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unviewed notices count' });
  }
};

// ✅ Mark notice as viewed
exports.markAllNoticesAsViewed = async (req, res) => {
  try {
    await Notice.updateMany(
      { viewedBy: { $ne: req.user._id } }, // notices user hasn't seen
      { $addToSet: { viewedBy: req.user._id } } // add user to viewedBy
    );
    res.json({ message: 'All notices marked as viewed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notices' });
  }
};