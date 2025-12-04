const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create Post
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.create({ title, content, author: req.user.id });
    res.status(201).json(post);
  } catch {
    res.status(400).json({ error: "Error creating post" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "username").sort({createdAt: -1});
  res.json(posts);
});

// Get one post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "username");
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

// Update post
router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await post.updateOne(req.body);
  res.json({ message: "Updated" });
});

// Delete post
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await post.remove();
  res.json({ message: "Deleted" });
});

module.exports = router;