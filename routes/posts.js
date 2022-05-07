const express = require("express");
const router = express.Router();

const Post = require("../models/posts");
const User = require("../models/users");

const { appError } = require("../service/handleError");
const { checkReqParamsId } = require("../middleware/index");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");

require("../connections");

let posts = [];
/* GET users listing. */
router.get(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    posts = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo ",
      })
      .sort(timeSort);
    handleSuccess(res, posts);
  })
);

router.post(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const post = req.body;
    if (post !== undefined) {
      await Post.create(post);
      posts = await Post.find();
      handleSuccess(res, posts);
    } else {
      appError(400, "請填寫內容", next);
    }
  })
);

router.delete(
  "/",
  handleErrorAsync(async (req, res, next) => {
    await Post.deleteMany({});
    handleSuccess(res, []);
  })
);

router.delete(
  "/:id",
  handleErrorAsync(checkReqParamsId),
  handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    const isFinish = await Post.findByIdAndDelete(id);
    if (isFinish) {
      posts = await Post.find();
      handleSuccess(res, posts);
    } else {
      appError(400, "查無此ID", next);
    }
  })
);

router.patch(
  "/:id",
  handleErrorAsync(checkReqParamsId),
  handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = req.body;
    const isFinish = await Post.findByIdAndUpdate(id, post);
    if (isFinish) {
      posts = await Post.find();
      handleSuccess(res, posts);
    } else {
      appError(400, "查無此ID", next);
    }
  })
);

module.exports = router;
