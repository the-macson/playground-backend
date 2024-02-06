require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user/user.model');
const { signupSchema } = require('../validations');

exports.signup = async (req, res) => {
  try {
    const user = new User({
      name,
      username,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
    });
    const token = jwt.sign(
      { user_id: user._id, role: 'user' },
      process.env.JSONWEBTOKEN_SECRET,
      { expiresIn: 86400 },
    );
    user.authtoken = token;
    const newUser = await user.save();
    res.status(200).json({
      message: 'User registered successfully',
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      authtoken: newUser.authtoken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email is not valid' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    console.log(user.role);
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JSONWEBTOKEN_SECRET,
      { expiresIn: 86400 },
    );
    user.authtoken = token;
    const updatedUser = await user.save();
    res.status(200).json({
      message: 'User logged in successfully',
      id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      authtoken: updatedUser.authtoken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
