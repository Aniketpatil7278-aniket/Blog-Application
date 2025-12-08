// const express = require('express');
// const router = express.Router();
// const Comment = require('../models/Comment');
// const auth = require('../middleware/auth');

// // Create Comment
// router.post('/', auth, async (req, res) => {
//   try {
//     const { postId, content } = req.body;
//     const comment = await Comment.create({ post: postId, content, author: req.user.id });
//     await comment.populate('author', 'username');
//     res.status(201).json(comment);
//   } catch (e) {
//     res.status(400).json({ error: 'Error creating comment' });
//   }
// });

// // Get comments for a post
// router.get('/', async (req, res) => {
//   try {
//     const { post_id } = req.query;
//     if (!post_id) return res.status(400).json({ error: 'post_id required' });
//     const comments = await Comment.find({ post: post_id }).populate('author', 'username').sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to get comments' });
//   }
// });


// // Update comment
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);
//     if (!comment) return res.status(404).json({ error: 'Not found' });
//     if (comment.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
//     comment.content = req.body.content !== undefined ? req.body.content : comment.content;
//     await comment.save();
//     res.json(comment);
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to update comment' });
//   }
// });

// // Delete comment
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);
//     if (!comment) return res.status(404).json({ error: 'Not found' });

//     console.log("Comment Author:", comment.author.toString());
//     console.log("User From Token:", req.user.id);

//     if (comment.author.toString() !== req.user.id)
//       return res.status(403).json({ error: 'Forbidden' });

//     await comment.remove();
//     res.json({ message: 'Deleted' });
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to delete' });
//   }
// });


// module.exports = router;




const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Create Comment
router.post('/', auth, async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) return res.status(400).json({ error: 'postId and content required' });

    const comment = await Comment.create({ post: postId, content, author: req.user.id });
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (e) {
    console.error('POST /api/comments error:', e);
    res.status(500).json({ error: 'Error creating comment' });
  }
});

// Get comments for a post
router.get('/', async (req, res) => {
  try {
    const { post_id } = req.query;
    if (!post_id) return res.status(400).json({ error: 'post_id required' });
    const comments = await Comment.find({ post: post_id }).populate('author', 'username').sort({ createdAt: -1 });
    res.json(comments);
  } catch (e) {
    console.error('GET /api/comments error:', e);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Not found' });

    console.log('PUT /api/comments/:id => req.user.id=', req.user.id, 'comment.author=', comment.author.toString());

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you are not the author' });
    }

    const newContent = req.body.content;
    if (typeof newContent !== 'string' || newContent.trim() === '') {
      return res.status(400).json({ error: 'content is required' });
    }

    comment.content = newContent;
    await comment.save();
    await comment.populate('author', 'username');
    res.json(comment);
  } catch (e) {
    console.error(`PUT /api/comments/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Not found' });

    console.log('DELETE /api/comments/:id => req.user.id=', req.user.id, 'comment.author=', comment.author.toString());

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you are not the author' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(`DELETE /api/comments/${req.params.id} error:`, e);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;