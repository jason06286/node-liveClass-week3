const express = require("express");
const router = express.Router();

const Post = require("../models/posts");

const { appError } = require("../service/handleError");
const { checkReqParamsId } = require("../middleware/index");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const decoding = require("../service/decodingJWT");

router.get(
  "/posts",
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Posts']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '取得所有貼文內容'
      * #swagger.responses[200] = {
          description: '所有貼文內容',
        }
      * #swagger.responses[401] = {
          description: '未授權',
        }
      }
    */
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const posts = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo ",
      })
      .sort(timeSort);
    handleSuccess(res, 200, posts);
  })
);
router.get(
  "/posts/profile",
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Posts']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '取得所有個人貼文'
      * #swagger.responses[200] = {
          description: '所有個人貼文',
        }
      * #swagger.responses[401] = {
          description: '未授權',
        }
      }
    */
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const token = req.headers.authorization.split(" ")[1];
    const currentUser = await decoding(token);
    const posts = await Post.find({ id: currentUser.id }).sort(timeSort);

    handleSuccess(res, 200, posts);
  })
);

router.post(
  "/post",
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Posts']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '新增貼文'
        #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式",
            schema: { "user": {
                            "user": "userId",
                            "content": "string"
                            } }
            }
      * #swagger.responses[201] = {
          description: '新增的貼文',
        }
      * #swagger.responses[422] = {
          description: '資料填寫錯誤',
        }
      }
    */
    if (!req.body.post) {
      return appError(422, "欄位未填寫正確", next);
    }
    const post = req.body.post;
    if (!post.content) {
      return appError(422, "請填寫貼文內容", next);
    }
    const addPost = await Post.create(post);
    handleSuccess(res, 201, addPost);
  })
);

router.delete(
  "/posts",
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Posts']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '刪除所有貼文'
      * #swagger.responses[200] = {
          description: '刪除所有貼文成功',
        }
      * #swagger.responses[401] = {
          description: '沒有權限',
        }
      }
    */
    await Post.deleteMany({});
    handleSuccess(res, 200, null, "刪除所有貼文成功!!");
  })
);

router.delete(
  "/post/:id",
  handleErrorAsync(checkReqParamsId),
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Posts']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '刪除單筆貼文'
      * #swagger.responses[200] = {
          description: '刪除單筆貼文成功',
        }
      * #swagger.responses[401] = {
          description: '沒有權限',
        }
      }
    */
    const id = req.params.id;
    const deletePost = await Post.findByIdAndDelete(id);
    if (!deletePost) {
      return appError(400, "查無此ID", next);
    }
    handleSuccess(res, 200, null, "刪除單筆貼文成功!");
  })
);

router.patch(
  "/post/:id",
  handleErrorAsync(checkReqParamsId),
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Posts']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '編輯單筆貼文'
        #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式",
            schema: { "user": {
                            "content": "string",
                            } }
            }
      * #swagger.responses[201] = {
          description: '編輯後的貼文',
        }
      * #swagger.responses[422] = {
          description: '資料填寫錯誤',
        }
      }
    */
    if (!req.body.post) {
      return appError(422, "欄位未填寫正確", next);
    }
    const { id } = req.params;
    const { post } = req.body;
    const newPost = await Post.findByIdAndUpdate(id, post, { new: true });
    if (!newPost) {
      return appError(400, "查無此ID", next);
    }

    handleSuccess(res, 201, newPost);
  })
);

module.exports = router;
