const { default: mongoose } = require("mongoose");
const AppError = require("../utils/AppError");
const teamModel = require("../models/teamModel");

const isTeamActivate = async (req, res, next) => {
  const teamId = req.user.teamId;

  if (!teamId) {
    throw new AppError(403, "You are not assigned to any team");
  }

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    throw new AppError(400, "Invalid team ID");
  }

  const foundTeam = await teamModel.findOne({
    _id: teamId,
    organisationId: req.user.organisationId._id,
  });

  if (!foundTeam || !foundTeam.isActive) {
    throw new AppError(404, "Team does not exist");
  }

  next();
};

module.exports = isTeamActivate;
