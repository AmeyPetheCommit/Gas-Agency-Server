const User = require('../models/User');

const checkAndResetCylinders = async (user) => {
  const now = new Date();
  const lastReset = new Date(user.lastReset);

  // Check if it's a new calendar year
  if (now.getFullYear() > lastReset.getFullYear()) {
    user.cylindersLeft = 12;
    user.lastReset = now;
    await user.save();
  }

  return user;
};

module.exports = checkAndResetCylinders;
