const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const teamModel = require("../models/teamModel");
const AppError = require("../utils/AppError");

async function accessibleTeam(req, teamId) {
  if (!mongoose.Types.ObjectId.isValid(teamId)) throw new AppError(400, "Invalid team ID");
  const query = { _id: teamId, isActive: true };
  if (req.user.role === "admin") Object.assign(query, { organisationId: req.user.organisationId._id, adminId: req.user._id });
  else if (req.user.role === "employee") Object.assign(query, { organisationId: req.user.organisationId._id, _id: req.user.teamId });
  const team = await teamModel.findOne(query);
  if (!team) throw new AppError(404, "Team not found");
  return team;
}

module.exports.getTeamMessages = async (req, res) => {
  const team = await accessibleTeam(req, req.params.teamId);
  const before = req.query.before ? new Date(req.query.before) : new Date();
  const messages = await messageModel.find({ teamId: team._id, organisationId: team.organisationId, createdAt: { $lt: before } })
    .sort({ createdAt: -1 }).limit(100).populate("senderId", "name");
  res.status(200).json({ data: messages.reverse() });
};

module.exports.createTeamMessage = async (req, res) => {
  const team = await accessibleTeam(req, req.params.teamId);
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!content || content.length > 2000) throw new AppError(400, "Message must be between 1 and 2000 characters");
  const message = await messageModel.create({ senderId: req.user._id, teamId: team._id, organisationId: team.organisationId, content });
  await message.populate("senderId", "name");
  res.status(201).json({ data: message });
};
