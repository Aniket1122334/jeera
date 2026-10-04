const orgModel = require("../../models/orgModel");
const userModel = require("../../models/userModel");
const teamModel = require("../../models/teamModel");
const taskModel = require("../../models/taskModel");

module.exports.getOwnerDashboardStats = async (req, res) => {
  const totalOrganisations = await orgModel.countDocuments({
    isActive: true,
  });

  const activeAdmins = await userModel.countDocuments({
    role: "admin",
    isActive: true,
  });

  const totalUsers = await userModel.countDocuments({
    role: { $in: ["admin", "employee"] },
  });

  const activeUsers = await userModel.countDocuments({
    role: { $in: ["admin", "employee"] },
    isActive: true,
  });

  //   Active Users / Total Users × 100

  const platformActivity =
    totalUsers === 0 ? 0 : Math.round((activeUsers / totalUsers) * 100);

  return res.status(200).json({
    msg: "Dashboard stats fetched successfully",
    data: {
      totalOrganisations,
      activeAdmins,
      totalUsers,
      platformActivity,
    },
  });
};

module.exports.getAdminDashboardStats = async (req, res) => {
  const organisationId = req.user.organisationId._id;
  const adminId = req.user._id;

  // Get all teams managed by this admin
  const teams = await teamModel
    .find({
      organisationId,
      adminId,
    })
    .select("_id");

  const teamIds = teams.map((team) => team._id);

  // Total employees in admin's teams
  const totalEmployees = await userModel.countDocuments({
    organisationId,
    role: "employee",
    teamId: { $in: teamIds },
  });

  // Total tasks
  const totalTasks = await taskModel.countDocuments({
    organisationId,
    teamId: { $in: teamIds },
  });

  // Active tasks
  // todo + in-progress
  const activeTasks = await taskModel.countDocuments({
    organisationId,
    teamId: { $in: teamIds },
    status: {
      $in: ["todo", "in-progress"],
    },
  });

  // Pending tasks
  // todo
  const pendingTasks = await taskModel.countDocuments({
    organisationId,
    teamId: { $in: teamIds },
    status: "todo",
  });

  // Completed tasks
  const completedTasks = await taskModel.countDocuments({
    organisationId,
    teamId: { $in: teamIds },
    status: "completed",
  });

  return res.status(200).json({
    msg: "Admin dashboard stats fetched successfully",
    data: {
      totalTeams: teamIds.length,
      totalEmployees,
      totalTasks,
      activeTasks,
      pendingTasks,
      completedTasks,
    },
  });
};
