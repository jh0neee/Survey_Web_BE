const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("인증이 실패했습니다.");
    }
    const decodedToken = jwt.verify(token, "jwt_secret");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("인증에 실패했습니다. 다시 시도해주세요.", 401);
    return next(error);
  }
};
