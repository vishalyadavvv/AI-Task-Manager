const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Express 5: async errors are automatically forwarded to the error handler — no try/catch needed

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return res.status(200).json({
    token,
    user: { id: user._id.toString(), email: user.email, name: user.name },
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password, // Mongoose pre-save hook handles hashing
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return res.status(201).json({
    token,
    user: { id: user._id.toString(), email: user.email, name: user.name },
  });
};

const me = (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = { login, register, me };
