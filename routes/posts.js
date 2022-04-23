const express = require("express");
const router = express.Router();

const Post = require("../models/posts");

const handleSuccess = require("../service/handleSuccess");
const handleError = require("../service/handleError");

require("../connections");

let posts = [];
/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    posts = await Post.find();
    handleSuccess(res, posts);
  } catch (error) {
    handleError(res, error.message);
  }
});

router.post("/", async (req, res, next) => {
  const post = req.body;
  try {
    if (post !== undefined) {
      await Post.create(post);
      posts = await Post.find();
      handleSuccess(res, posts);
    } else {
      handleError(res, 4003);
    }
  } catch (error) {
    handleError(res, error.message);
  }
});

router.delete("/", async (req, res, next) => {
  await Post.deleteMany({});
  handleSuccess(res, []);
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const isFinish = await Post.findByIdAndDelete(id);
    if (isFinish) {
      posts = await Post.find();
      handleSuccess(res, posts);
    } else {
      handleError(res, 4004);
    }
  } catch (error) {
    handleError(res, error.message);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = req.body;
    const isFinish = await Post.findByIdAndUpdate(id, post);
    if (isFinish) {
      posts = await Post.find();
      handleSuccess(res, posts);
    } else {
      handleError(res, 4004);
    }
  } catch (error) {
    handleError(res, error.message);
  }
});

module.exports = router;
