const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const { appError } = require("../service/handleError");
const { isAuth } = require("../middleware/index");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const decoding = require("../service/decodingJWT");

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  const { email, name } = user;
  const data = {
    message: "登入成功",
    email,
    name,
    token: `Bearer ${token}`,
  };
  handleSuccess(res, statusCode, data);
};

router.get(
  "/check",
  handleErrorAsync(isAuth),
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Check']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '登入權限測試'
      * #swagger.responses[200] = {
          description: 'OK',
        }
      * #swagger.responses[401] = {
          description: '未授權',
        }
      }
    */
    handleSuccess(res, 200, null, "已授權");
  })
);

router.post(
  "/users/sign_up",
  handleErrorAsync(async (req, res, next) => {
    /**
     * #swagger.tags = ['Users']
        * #swagger.summary = '使用者註冊'
        #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式",
            schema: { "user": {
                            "email": "string",
                            "name": "string",
                            "password": "string",
                            "photo":"string"
                            } }
            }
     * #swagger.responses[200] = {
          description: '註冊成功',
          
        }
     * #swagger.responses[422] = {
          description: '註冊失敗',
          
        }
    }
     */
    if (!req.body.user) {
      return appError(422, "欄位未填寫正確", next);
    }
    const { name, email, password } = req.body.user;
    const errMessage = {};
    if (!name || !email || !password) {
      return appError(422, "欄位未填寫正確", next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      errMessage.password = "密碼 字數太少，至少需要 8 個字";
    }
    if (!validator.isEmail(email)) {
      errMessage.email = "電子信箱 格式有誤";
    }
    console.log("errMessage :>> ", errMessage);
    if (Object.keys(errMessage).length) {
      return appError(422, errMessage, next);
    }
    // 比對 資料庫email
    const isRegister = await User.findOne({ email });
    //成功註冊回傳資料，隱藏password
    if (!isRegister) {
      let newUser;
      if (!req.body.user.photo) {
        newUser = await User.create({
          name,
          email,
          password: await bcrypt.hash(password, 12),
        });
      } else {
        newUser = await User.create({
          name,
          email,
          photo: req.body.user.photo,
          password: await bcrypt.hash(password, 12),
        });
      }

      const resData = {
        message: "註冊成功",
        email: newUser.email,
        name: newUser.name,
        photo: newUser.photo,
        _id: newUser._id,
      };
      handleSuccess(res, 200, resData);
    } else {
      return appError(422, "此信箱已註冊過", next);
    }
  })
);

router.post(
  "/users/sign_in",
  handleErrorAsync(async (req, res, next) => {
    /**
     * #swagger.tags = ['Users']
        * #swagger.summary = '使用者登入'
        #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式",
            schema: { "user": {
                            "email": "string",
                            "password": "string"
                            } }
            }
     * #swagger.responses[200] = {
          description: '登入成功',
          
        }
     * #swagger.responses[401] = {
          description: '登入失敗',
          
        }
    }
     */
    console.log("req.body.user :>> ", req.body.user);
    if (!req.body.user) {
      return appError(401, "資料格式錯誤", next);
    }
    const { email, password } = req.body.user;
    if (!email || !password) {
      return appError(401, "欄位未填寫正確", next);
    }
    if (!validator.isEmail(email)) {
      return appError(401, "電子信箱 格式有誤", next);
    }
    const user = await User.findOne({ email }).select("+password");
    console.log("user :>> ", user);
    if (!user) {
      return appError(401, "此電子信箱尚未註冊", next);
    }

    const auth = await bcrypt.compare(password, user.password);
    console.log("auth :>> ", auth);
    if (!auth) {
      return appError(401, "密碼有誤，請重新輸入", next);
    }
    generateSendJWT(user, 200, res);
  })
);

router.delete(
  "/users/sign_out",
  handleErrorAsync(isAuth),
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Users']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '使用者登出'
      * #swagger.responses[200] = {
          description: '登出成功',
        }
      * #swagger.responses[401] = {
          description: '登出失敗',
        }
      }
    */
    handleSuccess(res, 200, null, "登出成功");
  })
);

router.get(
  "/users/profile",
  handleErrorAsync(isAuth),
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Users']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '取得個人資料'
      * #swagger.responses[200] = {
          description: '個人資料',
        }
      * #swagger.responses[401] = {
          description: '沒有權限',
        }
      }
    */
    const token = req.headers.authorization.split(" ")[1];
    const currentUser = await decoding(token);
    const user = await User.findById(currentUser.id);

    handleSuccess(res, 200, user);
  })
);

router.patch(
  "/users/profile",
  handleErrorAsync(isAuth),
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Users']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '更新個人資料'
        #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式",
            schema: { "user": {
                            "name": "string",
                            "photo": "string"
                            } }
            }
      * #swagger.responses[201] = {
          description: '更新後的個人資料',
        }
      * #swagger.responses[422] = {
          description: '資料填寫錯誤',
        }
      }
    */
    if (!req.body.user) {
      return appError(401, "欄位未填寫正確", next);
    }
    const editUserData = {};
    if (req.body.user.name) {
      editUserData.name = req.body.user.name;
    }
    if (req.body.user.photo) {
      editUserData.photo = req.body.user.photo;
    }
    if (!Object.keys(editUserData).length) {
      return appError(422, "欄位未填寫正確", next);
    }

    const token = req.headers.authorization.split(" ")[1];
    const currentUser = await decoding(token);
    const newUser = await User.findByIdAndUpdate(currentUser.id, editUserData, {
      new: true,
    });
    handleSuccess(res, 201, newUser);
  })
);

router.post(
  "/users/updatePassword",
  handleErrorAsync(isAuth),
  handleErrorAsync(async (req, res, next) => {
    /**
      * #swagger.tags = ['Users']
        #swagger.security = [{ "apiKeyAuth": [] }]
         * #swagger.summary = '重設使用者密碼'
        #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式",
            schema: { "user": {
                            "password": "string"
                            } }
            }
      * #swagger.responses[201] = {
          description: '更新後的個人資料',
        }
      * #swagger.responses[422] = {
          description: '資料填寫錯誤',
        }
      }
    */
    if (!req.body.user) {
      return appError(422, "欄位未填寫正確", next);
    }
    const { password } = req.body.user;
    if (!password) {
      return appError(422, "欄位未填寫正確", next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError(422, "密碼 字數太少，至少需要 8 個字", next);
    }
    const token = req.headers.authorization.split(" ")[1];
    const currentUser = await decoding(token);
    const newUser = await User.findByIdAndUpdate(
      currentUser.id,
      { password: await bcrypt.hash(password, 12) },
      { new: true }
    );
    handleSuccess(res, 200, null, "密碼重設成功!");
  })
);

module.exports = router;
