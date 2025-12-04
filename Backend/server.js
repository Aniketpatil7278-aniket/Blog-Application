require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./src/routes/user");
const postRoutes = require("./src/routes/post");
const commentRoutes = require("./src/routes/comment");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Remove the old options! Just pass the URL
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on ${process.env.PORT}`)
    );
  })
  .catch(e => console.error("DB ERROR:", e));