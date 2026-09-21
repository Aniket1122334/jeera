const { default: mongoose } = require("mongoose");
const teamModel = require("../../models/teamModel");
const AppError = require("../../utils/AppError");

module.exports.addTeam = async (req, res) => {
  const { name } = req.body;

  if (!name?.trim() || name?.trim().length > 50) {
    throw new AppError(400, "Name is Invalid");
  }

  const createdTeam = await teamModel.create({
    name,
    adminId: req.user._id,
    organisationId: req.user.organisationId?._id,
  });

  res.status(201).json({
    msg: "Team created successfully",
    data: createdTeam,
  });
};

module.exports.getAllTeams = async (req, res) => {
  if (req.user.role === "owner") {
    // Owner is global, so fetch all teams
    foundTeams = await teamModel.find();
  } else {
  }
  // Admin can only see teams of their organisation and the teams that he/she created
  const organisationId = req.user.organisationId._id;

  foundTeams = await teamModel.find({
    organisationId,
    adminId: req.user._id,
  });
  return res.status(200).json({
    msg: "Teams fetched successfully",
    count: foundTeams.length,
    data: foundTeams,
  });
};

module.exports.getTeamById = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid team ID");
  }

  let foundTeam;

  if (req.user.role === "owner") {
    // owner has global access
    foundTeam = await teamModel.findById(id);
  } else {
    // admin can access only their team's data
    foundTeam = await teamModel.findOne({
      _id: id,
      organisationId: req.user.organisationId._id,
      adminId: req.user._id,
    });
  }

  if (!foundTeam) {
    throw new AppError(404, "Team not found");
  }

  return res.status(200).json({
    msg: "Team fetched successfully",
    data: foundTeam,
  });
};

module.exports.deactivateTeam = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid team ID");
  }

  let deactivedTeam;

  if (req.user.role === "owner") {
    deactivedTeam = await teamModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { returnDocument: "after" },
    );
  } else {
    deactivedTeam = await teamModel.findOneAndUpdate(
      {
        _id: id,
        organisationId: req.user.organisationId._id,
        adminId: req.user._id,
      },
      { isActive: false },
      { returnDocument: "after" },
    );
  }

  if (!deactivedTeam) {
    throw new AppError(404, "Team not found");
  }

  return res.status(200).json({
    msg: "Team deactivated successfully",
    data: deactivedTeam,
  });
};

module.exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, isActive = true } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid team ID");
  }

  const trimmedName = name?.trim();

  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 50) {
    throw new AppError(400, "Team name must be between 2 and 50 characters");
  }

  let updatedTeam;

  if (req.user.role === "owner") {
    updatedTeam = await teamModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        name: trimmedName,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  } else {
    updatedTeam = await teamModel.findOneAndUpdate(
      {
        _id: id,
        organisationId: req.user.organisationId._id,
        adminId: req.user._id,
      },
      {
        name: trimmedName,
        isActive,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  if (!updatedTeam) {
    throw new AppError(404, "Team not found");
  }

  return res.status(200).json({
    msg: "Team updated successfully",
    data: updatedTeam,
  });
};
