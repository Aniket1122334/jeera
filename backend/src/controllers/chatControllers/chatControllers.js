const mongoose = require("mongoose");
const messageModel = require("../../models/messageModel");
const userModel = require("../../models/userModel");
const AppError = require("../../utils/AppError");
module.exports.adminChats = async (req, res) => {
  const organisationId = req.user.organisationId._id;
  const adminId = req.user._id;

  const users = await userModel
    .find({
      organisationId,
      isActive: true,
      _id: { $ne: adminId },
    })
    .select("name email role teamId")
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
      isActive: true,
      _id: { $ne: employeeId },

      $or: [
        // Same team ke employees
        {
          role: "employee",
          teamId,
        },

        // Same organisation ke admins
        {
          role: "admin",
        },
      ],
    })
    .select("name email role teamId")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    msg: "Team and organisation admins fetched successfully",
    count: users.length,
    data: users,
  });
};

module.exports.getMessages = async (req, res) => {
  const userId = req.user._id;
  const organisationId = req.user.organisationId._id;
  const { receiverId } = req.params;

  // Validate receiver ID
  if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new AppError(400, "Invalid receiver ID");
  }

  // Prevent fetching messages with yourself
  if (userId.toString() === receiverId) {
    throw new AppError(400, "You cannot fetch messages with yourself");
  }

  // Check receiver belongs to the same organization
  const receiver = await userModel.findOne({
    _id: receiverId,
    organisationId,
    isActive: true,
  });

  if (!receiver) {
    throw new AppError(404, "Receiver not found");
  }

  // Fetch conversation messages
  const messages = await messageModel
    .find({
      organisationId,
      $or: [
        {
          senderId: userId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: userId,
        },
      ],
    })
    .sort({ createdAt: 1 });

  return res.status(200).json({
    msg: "Messages fetched successfully",
    count: messages.length,
    data: messages,
  });
};

module.exports.getUnreadCounts = async (req, res) => {
  const currentUserId = req.user._id;
  const organisationId =
    req.user.organisationId?._id || req.user.organisationId;

  const unreadMessages = await messageModel.aggregate([
    {
      $match: {
        receiverId: new mongoose.Types.ObjectId(String(currentUserId)),
        organisationId: new mongoose.Types.ObjectId(String(organisationId)),
        isRead: false,
      },
    },
    {
      $group: {
        _id: "$senderId",
        count: { $sum: 1 },
      },
    },
  ]);

  const bySender = {};
  let totalUnread = 0;

  unreadMessages.forEach(({ _id, count }) => {
    bySender[String(_id)] = count;
    totalUnread += count;
  });

  return res.status(200).json({
    msg: "Unread counts fetched successfully",
    data: { totalUnread, bySender },
  });
};
