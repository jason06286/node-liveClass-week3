const express = require("express");

const errorMessage = {
  4001: "無此路由",
  4002: "資料格式錯誤!",
  4003: '欄位未填寫正確!請用{"title":"XXX"}',
  4004: "無此ID",
};

const handleError = (res, error) => {
  res.status(400).json({
    success: false,
    message: errorMessage[error] !== undefined ? errorMessage[error] : error,
  });
};

module.exports = handleError;
