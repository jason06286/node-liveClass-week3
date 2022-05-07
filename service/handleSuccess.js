const express = require("express");

const handleSuccess = (res, data) => {
  res.status(200).send({ success: true, data });
};

module.exports = handleSuccess;
