require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./src/routes/user');
const postRoutes = require('./src/routes/post');
const commentRoutes = require('./src/routes/comment');

const app = express();
app.use(cors());
app.use(express.json());

// API prefix
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Connect DB and start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(e => {
    console.error('DB ERROR:', e);
    process.exit(1);
  });

module.exports = app;