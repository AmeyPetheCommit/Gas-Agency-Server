const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate unique consumer number
const generateConsumerNumber = () => {
  return 'GAS' + Math.floor(1000000000 + Math.random() * 9000000000);
};

exports.register = async (req, res) => {
  const { name,mobile, email, password } = req.body;
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      consumerNumber: generateConsumerNumber(), // auto-generate
      cylindersLeft: 12, // default
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully', consumerNumber: newUser.consumerNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      isAdmin: user.isAdmin  // 👈 send this to client
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};
