const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment'); // remove related comments on delete
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const tagsArray = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
    const post = await Post.create({ title, content, tags: tagsArray, author: req.user.id });
    res.status(201).json(post);
  } catch (e) {
    console.error('POST /api/posts error:', e);
    res.status(400).json({ error: 'Error creating post' });
  }
});

// Get posts (search, tag filter, pagination)
router.get('/', async (req, res) => {
  try {
    const { search, tag } = req.query;
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '10')));
    const skip = (page - 1) * limit;

    const filter = {};
    if (tag) filter.tags = tag.toLowerCase();
    if (search) filter.$text = { $search: search };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username'),
      Post.countDocuments(filter)
    ]);

    const result = posts.map(p => {
      const obj = p.toObject();
      obj.likeCount = p.likes ? p.likes.length : 0;
      return obj;
    });

    res.json({ posts: result, pagination: { page, limit, total } });
  } catch (e) {
    console.error('GET /api/posts error:', e);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID' });
    const post = await Post.findById(id).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Not found' });
    const obj = post.toObject();
    obj.likeCount = post.likes ? post.likes.length : 0;
    res.json(obj);
  } catch (e) {
    console.error(`GET /api/posts/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // Apply updates from request body
    const { title, content, tags } = req.body;
    if (typeof title === 'string') post.title = title;
    if (typeof content === 'string') post.content = content;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
    }

    await post.save();
    const populated = await Post.findById(post._id).populate('author', 'username');
    res.json(populated);
  } catch (e) {
    console.error(`PUT /api/posts/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // Remove the post (use findByIdAndDelete)
    await Post.findByIdAndDelete(id);

    // Optionally remove related comments
    try {
      await Comment.deleteMany({ post: id });
    } catch (subErr) {
      console.warn('Failed to delete related comments:', subErr);
    }

    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(`DELETE /api/posts/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Toggle like/unlike (unchanged)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Not found' });

    const idx = post.likes.findIndex(u => u.toString() === userId);
    if (idx === -1) {
      post.likes.push(userId);
      await post.save();
      return res.json({ liked: true, likeCount: post.likes.length });
    } else {
      post.likes.splice(idx, 1);
      await post.save();
      return res.json({ liked: false, likeCount: post.likes.length });
    }
  } catch (e) {
    console.error(`POST /api/posts/${req.params.id}/like error:`, e);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Get list of tags
router.get('/tags/list', async (req, res) => {
  try {
    const agg = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);
    res.json(agg.map(a => ({ tag: a._id, count: a.count })));
  } catch (e) {
    console.error('GET /api/posts/tags/list error:', e);
    res.status(500).json({ error: 'Failed to list tags' });
  }
});

module.exports = router;