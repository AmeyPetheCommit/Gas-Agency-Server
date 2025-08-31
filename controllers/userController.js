const checkAndResetCylinders = require('../utils/resetCylinders');

exports.getProfile = async (req, res) => {
  try {
    const updatedUser = await checkAndResetCylinders(req.user);
    const {
      name, email, consumerNumber, cylindersLeft, mobile,
      createdAt, lastBooking, address, lastReset
    } = updatedUser;

    res.json({
      name, email, consumerNumber, cylindersLeft, mobile,
      createdAt, lastBooking, address, lastReset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { apartment, building, street, city } = req.body;
    user.address = { apartment, building, street, city };

    await user.save();
    res.json({ message: 'Address updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update address' });
  }
};
