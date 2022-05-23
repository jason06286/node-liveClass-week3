const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  /**
   * #swagger.ignore = true
   */
  res.render("index", { title: "歡迎來到首頁" });
});

module.exports = router;
