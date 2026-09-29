const orgModel = require("../../models/orgModel");
const userModel = require("../../models/userModel");

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
