const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "user ID 未填寫"],
    },
    tags: {
      type: [String],
      default: ["謎因", "遊記"],
    },
    image: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: [true, "請輸入貼文內容"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "group",
    },
  },
  {
    versionKey: false,
  }
);
const Post = mongoose.model("post", PostSchema);

module.exports = Post;
