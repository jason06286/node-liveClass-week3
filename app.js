const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");

const swaggerUi = require("swagger-ui-express");
const swaggerSetting = require("./config/swagger");

const {
  appError,
  resErrorDev,
  resErrorProd,
} = require("./service/handleError");

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

app.use("/", indexRouter);
app.use("/posts", postsRouter);

require("./unpredictable");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSetting));

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
