const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const validator = require("validator");

const isLoggedIn = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new AppError(401, "Please login first");
  }

  if (!validator.isJWT(token)) {
    throw new AppError(401, "Please provide a valid token");
  }

  const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

  req.user = {
    id: decodedObj.id,
  };

  next();
};

module.exports = isLoggedIn;
