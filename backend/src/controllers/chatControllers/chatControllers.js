const userModel = require("../../models/userModel");

module.exports.adminChats = async (req, res) => {
  const organisationId = req.user.organisationId._id;
  const adminId = req.user._id;

  const users = await userModel
    .find({
      organisationId,
      isActive: true,
      _id: { $ne: adminId },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    msg: "Organisation users fetched successfully",
    count: users.length,
    data: users,
  });
};

module.exports.employeeChats = async (req, res) => {
  const organisationId = req.user.organisationId._id;
  const teamId = req.user.teamId;
  const employeeId = req.user._id;

  if (!teamId) {
    throw new AppError(403, "You are not assigned to any team");
  }

  const users = await userModel
    .find({
      organisationId,
      teamId,
      _id: { $ne: employeeId },
      isActive: true,
    })
    .select("name email role teamId")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    msg: "Team users fetched successfully",
    count: users.length,
    data: users,
  });
};
