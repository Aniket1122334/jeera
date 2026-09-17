const AppError = require("../utils/AppError");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Unauthorized Operation");
    }

    next();
  };
};

module.exports = authorize;
