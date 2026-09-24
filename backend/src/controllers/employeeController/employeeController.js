const { default: mongoose } = require("mongoose");
const taskModel = require("../../models/taskModel");
const AppError = require("../../utils/AppError");

module.exports.getAllTasksByEmployee = async (req, res) => {
  let allTasks;

  // Owner can see all tasks
  if (req.user.role === "owner") {
    allTasks = await taskModel.find();
  }

  // Employee can see only assigned tasks
  else if (req.user.role === "employee") {
    allTasks = await taskModel.find({
      assignedTo: req.user._id,
      organisationId: req.user.organisationId._id,
    });
  } else {
    throw new AppError(403, "You are not allowed to access these tasks");
  }

  return res.status(200).json({
    msg: "Tasks fetched successfully",
    count: allTasks.length,
    data: allTasks,
  });
};

module.exports.getTaskByIdByEmployee = async (req, res) => {
  const { taskId } = req.params;

  // Validate Task ID
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError(400, "Invalid Task ID");
  }

  let data;

  // Owner can access any task
  if (req.user.role === "owner") {
    data = await taskModel.findOne({
      _id: taskId,
    });
  }

  // Employee can access only their assigned task
  else if (req.user.role === "employee") {
    data = await taskModel.findOne({
      _id: taskId,
      assignedTo: req.user._id,
      organisationId: req.user.organisationId._id,
    });
  } else {
    throw new AppError(403, "You are not allowed to access this task");
  }

  if (!data) {
    throw new AppError(404, "Task not found");
  }

  return res.status(200).json({
    msg: "Task fetched successfully",
    data,
  });
};

module.exports.updateTaskByEmployee = async (req, res) => {
  const { status } = req.body;
  const { taskId } = req.params;

  // Validate Task ID
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError(400, "Invalid Task ID");
  }

  // Validate Status
  if (
    !status ||
    !["todo", "in-progress", "completed"].includes(status.trim().toLowerCase())
  ) {
    throw new AppError(400, "Invalid Status");
  }

  // Employee can update only their own assigned task
  const data = await taskModel.findOneAndUpdate(
    {
      _id: taskId,
      assignedTo: req.user._id,
      organisationId: req.user.organisationId._id,
    },
    {
      status: status.trim().toLowerCase(),
    },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );

  if (!data) {
    throw new AppError(404, "Task not found");
  }

  return res.status(200).json({
    message: "Task status updated successfully",
    data,
  });
};
