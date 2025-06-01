
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateRegistration, validateLogin } = require('../utils/validator');
const User = require('../models/user');

const register = async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;
  const profile_image_path = req.file ? '/' + req.file.path.replace('\\', '/') : null;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: 'Email already in use' });

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password_hash, profile_image_path });
  await newUser.save();

  res.status(201).json({ message: 'User registered', user: newUser });
};

const login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const validPass = await bcrypt.compare(password, user.password_hash);
  if (!validPass) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'Login successful', token });
};

module.exports = { register, login };
