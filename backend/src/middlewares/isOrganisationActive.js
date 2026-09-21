const AppError = require("../utils/AppError");

const isOrganisationActive = (req, res, next) => {
  if (req.user.role == "owner") {
    next();
  } else {
    if (!req.user.organisationId.isActive) {
      throw new AppError(403, "Organisation is inactive");
    }

    next();
  }
};

module.exports = isOrganisationActive;
