const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Register the user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    res.status(201).json({ user: { _id: user._id, username, email } });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Registration failed' });
  }
});

// Login the user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'No account' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Bad password' });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Get public profile & user's posts (paginated)
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '10')));
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username');

    const total = await Post.countDocuments({ author: userId });

    res.json({ user, posts, pagination: { page, limit, total } });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get current user info
router.get('/me', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select('-password');
    res.json({ user: me });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;