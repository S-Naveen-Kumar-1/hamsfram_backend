const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Guest" },
  timestamp: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    detailedDescription: String,
    authorName: String,

    likes: {
      type: Number,
      default: 0,
    },

    comments: [commentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
