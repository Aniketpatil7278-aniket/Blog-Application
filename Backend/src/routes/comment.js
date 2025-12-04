const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Create Comment
router.post("/", auth, async (req, res) => {
  const { postId, content } = req.body;
  try {
    const comment = await Comment.create({ post: postId, content, author: req.user.id });
    res.status(201).json(comment);
  } catch {
    res.status(400).json({ error: "Error creating comment" });
  }
});

// Get comments for a post
router.get("/", async (req, res) => {
  const { post_id } = req.query;
  if (!post_id) return res.status(400).json({ error: "post_id required" });
  const comments = await Comment.find({ post: post_id }).populate("author", "username").sort({createdAt: -1});
  res.json(comments);
});

// Get one comment
router.get("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate("author", "username");
  if (!comment) return res.status(404).json({ error: "Not found" });
  res.json(comment);
});

// Update comment
router.put("/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment || comment.author.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await comment.updateOne(req.body);
  res.json({ message: "Updated" });
});

// Delete comment
router.delete("/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment || comment.author.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await comment.remove();
  res.json({ message: "Deleted" });
});

module.exports = router;