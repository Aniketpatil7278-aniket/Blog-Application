const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags:      [{ type: String, lowercase: true, trim: true }],
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

PostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', PostSchema);