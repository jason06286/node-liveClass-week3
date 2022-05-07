const { appError } = require("../service/handleError");

const checkReqParamsId = async (req, res, next) => {
  const { id } = req.params;
  if (id.length === 24) {
    next();
  } else {
    appError(400, "請帶入正確ID", next);
  }
};

module.exports = {
  checkReqParamsId,
};
