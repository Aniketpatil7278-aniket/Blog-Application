const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    res.status(201).json({ user: { _id: user._id, username, email } });
  } catch {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "No account" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Bad password" });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.json({ token });
  } catch {
    res.status(400).json({ error: "Login failed" });
  }
});

module.exports = router;