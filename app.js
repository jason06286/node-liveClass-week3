const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const uploadRouter = require("./routes/upload");

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

const {
  appError,
  resErrorDev,
  resErrorProd,
} = require("./service/handleError");
const { isAuth } = require("./middleware/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("./connections");

app.use("/", indexRouter);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(usersRouter);

//需過認證
app.use(isAuth);
app.use(postsRouter);
app.use(uploadRouter);

require("./unpredictable");

// catch 404 and forward to error handler
app.use((req, res, next) => {
  appError(404, "無此路由，請回首頁!!", next);
});

// error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }

  if (err.name === "ValidationError") {
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
});

module.exports = app;
