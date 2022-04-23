const express = require("express");

const handleSuccess = (res, data) => {
  res.status(200).json({ success: true, data });
};

module.exports = handleSuccess;
