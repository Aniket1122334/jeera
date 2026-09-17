const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const validator = require("validator");
const userModel = require("../models/userModel");

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new AppError(401, "Please login first");
  }

  if (!validator.isJWT(token)) {
    throw new AppError(401, "Please provide a valid token");
  }

  const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

  const foundUser = await userModel.findById(decodedObj.id);

  if (!foundUser) {
    throw new AppError(400, "User not found");
  }

  req.user = foundUser;

  next();
};

module.exports = isLoggedIn;
