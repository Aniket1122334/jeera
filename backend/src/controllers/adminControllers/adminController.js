const { default: mongoose } = require("mongoose");
const teamModel = require("../../models/teamModel");
const AppError = require("../../utils/AppError");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");
const taskModel = require("../../models/taskModel");

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

/*

-- Admin controllers for employess

*/

module.exports.createEmployee = async (req, res) => {
  const { teamId } = req.params;

  if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
    throw new AppError(400, "Invalid Id");
  }

  const { name, password, email } = req.body;

  if (!name.trim() || name.trim().length > 20 || name.trim().length < 2) {
    throw new AppError(400, "Name must be between 2 and 20 characters");
  }

  if (!validator.isEmail(email)) {
    throw new AppError(400, "Invalid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new AppError(400, "Please Enter a Strong Password");
  }

  const foundTeam = await teamModel.findOne({
    _id: teamId,
    organisationId: req.user.organisationId._id,
    adminId: req.user._id,
  });

  if (!foundTeam) {
    throw new AppError(404, "Team not exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: "employee",
    teamId: teamId,
    organisationId: req.user.organisationId._id,
  });

  const employeeData = {
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role,
    organisationId: createdUser.organisationId,
    teamId: createdUser.teamId,
    isActive: createdUser.isActive,
  };

  res.status(201).json({
    msg: "Employee created successfully",
    data: employeeData,
  });
};

module.exports.getEmployeesById = async (req, res) => {
  const { teamId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    throw new AppError(400, "Invalid ID");
  }

  let allEmployees;

  if (req.user.role === "owner") {
    allEmployees = await userModel.find({
      teamId: teamId,
      role: "employee",
    });
  } else {
    const foundTeam = await teamModel.findOne({
      _id: teamId,
      organisationId: req.user.organisationId._id,
      adminId: req.user._id,
    });

    if (!foundTeam) {
      throw new AppError(404, "Team not exists");
    }

    allEmployees = await userModel.find({
      teamId: foundTeam._id,
      organisationId: req.user.organisationId._id,
      role: "employee",
      isActive: true,
    });
  }

  res.status(200).json({
    data: allEmployees,
  });
};

module.exports.deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new AppError(400, "Invalid ID");
  }

  let foundEmployee;

  if (req.user.role === "owner") {
    foundEmployee = await userModel.findById(employeeId);

    if (!foundEmployee) {
      throw new AppError(404, "User does not exists");
    }
  } else {
    foundEmployee = await userModel.findOne({
      _id: employeeId,
      organisationId: req.user.organisationId._id,
      isActive: true,
    });

    if (!foundEmployee) {
      throw new AppError(404, "User does not exists");
    }

    const foundTeam = await teamModel.findOne({
      _id: foundEmployee.teamId,
      organisationId: req.user.organisationId._id,
      adminId: req.user._id,
    });

    if (!foundTeam) {
      throw new AppError(
        403,
        "You do not have permission to delete this employee",
      );
    }
  }

  foundEmployee.isActive = false;
  await foundEmployee.save();

  const deletedUser = {
    name: foundEmployee.name,
    email: foundEmployee.email,
    role: foundEmployee.role,
  };
  res.status(200).json({
    message: "User deleted",
    data: deletedUser,
  });
};

module.exports.updateEmployee = async (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new AppError(400, "Invalid employee ID");
  }

  const { name, teamId, isActive } = req.body;

  // At least one field should be provided
  if (name === undefined && teamId === undefined && isActive === undefined) {
    throw new AppError(400, "Please provide at least one field to update");
  }

  // Validate name
  let trimmedName;

  if (name !== undefined) {
    trimmedName = name.trim();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 20) {
      throw new AppError(400, "Invalid name");
    }
  }

  // Validate teamId
  if (teamId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      throw new AppError(400, "Invalid team ID");
    }
  }

  let foundEmployee;

  // =========================
  // OWNER
  // =========================

  if (req.user.role === "owner") {
    foundEmployee = await userModel.findOne({
      _id: employeeId,
      role: "employee",
    });

    if (!foundEmployee) {
      throw new AppError(404, "Employee does not exist");
    }

    // Update name if provided
    if (name !== undefined) {
      foundEmployee.name = trimmedName;
    }

    // Update team if provided
    if (teamId !== undefined) {
      const foundTeam = await teamModel.findById(teamId);

      if (!foundTeam) {
        throw new AppError(404, "Team does not exist");
      }

      foundEmployee.teamId = foundTeam._id;

      // Keep organisation consistent
      foundEmployee.organisationId = foundTeam.organisationId;
    }

    if (isActive !== undefined) {
      foundEmployee.isActive = isActive;
    }

    await foundEmployee.save();
  }

  // =========================
  // ADMIN
  // =========================
  else {
    foundEmployee = await userModel.findOne({
      _id: employeeId,
      role: "employee",
      organisationId: req.user.organisationId,
    });

    if (!foundEmployee) {
      throw new AppError(404, "Employee does not exist");
    }

    // Verify current employee belongs to
    // a team managed by this admin
    const foundTeam = await teamModel.findOne({
      _id: foundEmployee.teamId,
      organisationId: req.user.organisationId,
      adminId: req.user._id,
    });

    if (!foundTeam) {
      throw new AppError(403, "team not exist");
    }

    // Update name if provided
    if (name !== undefined) {
      foundEmployee.name = trimmedName;
    }

    // Change team if provided
    if (teamId !== undefined) {
      const newTeam = await teamModel.findOne({
        _id: teamId,
        organisationId: req.user.organisationId,
        adminId: req.user._id,
      });

      if (!newTeam) {
        throw new AppError(
          403,
          "You do not have permission to assign this employee to this team",
        );
      }

      foundEmployee.teamId = newTeam._id;
    }

    if (isActive !== undefined) {
      foundEmployee.isActive = isActive;
    }

    await foundEmployee.save();
  }

  const updatedEmployee = {
    _id: foundEmployee._id,
    name: foundEmployee.name,
    email: foundEmployee.email,
    role: foundEmployee.role,
    organisationId: foundEmployee.organisationId,
    teamId: foundEmployee.teamId,
    updatedAt: foundEmployee.updatedAt,
  };

  return res.status(200).json({
    msg: "Employee updated successfully",
    data: updatedEmployee,
  });
};

/*

Admin task controllers

*/

module.exports.createTask = async (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new AppError(400, "Invalid employee ID");
  }

  // validation

  const { title, description, status, priority, dueDate } = req.body;

  const trimmedTitle = title?.trim();
  const trimmedDescription = description?.trim();
  const taskStatus = status?.trim().toLowerCase();
  const taskPriority = priority?.trim().toLowerCase();

  if (!trimmedTitle || trimmedTitle.length < 2 || trimmedTitle.length > 100) {
    throw new AppError(400, "Title must be between 2 and 100 characters");
  }

  if (!trimmedDescription || trimmedDescription.length > 1000) {
    throw new AppError(
      400,
      "Description must be between 1 and 1000 characters",
    );
  }

  if (
    !taskStatus ||
    !["todo", "in-progress", "completed"].includes(taskStatus)
  ) {
    throw new AppError(400, "Invalid status");
  }

  if (!taskPriority || !["low", "medium", "high"].includes(taskPriority)) {
    throw new AppError(400, "Invalid priority");
  }

  if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
    throw new AppError(400, "Invalid due date");
  }
  // verify employee and team
  const foundEmployee = await userModel.findOne({
    _id: employeeId,
    organisationId: req.user.organisationId._id,
    role: "employee",
    isActive: true,
  });

  if (!foundEmployee) {
    throw new AppError(404, "Employee doesnot not exists");
  }

  const foundTeam = await teamModel.findOne({
    _id: foundEmployee.teamId,
    organisationId: req.user.organisationId._id,
    adminId: req.user._id,
  });

  if (!foundTeam) {
    throw new AppError(403, "You do not have access to this employee");
  }

  const createdTask = await taskModel.create({
    title: trimmedTitle,
    description: trimmedDescription,
    status: taskStatus,
    priority: taskPriority,
    organisationId: req.user.organisationId._id,
    teamId: foundTeam._id,
    assignedTo: foundEmployee._id,
    createdBy: req.user._id,
    dueDate: new Date(dueDate),
  });

  res.status(201).json({
    msg: "Task created successfully",
    data: createdTask,
  });
};

module.exports.getAllTasks = async (req, res) => {
  let allTasks;

  if (req.user.role === "owner") {
    // Owner → all organisations/tasks
    allTasks = await taskModel
      .find()
      .populate("organisationId")
      .populate("teamId")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
  } else if (req.user.role === "admin") {
    // Admin → only own organisation
    allTasks = await taskModel
      .find({
        organisationId: req.user.organisationId,
      })
      .populate("teamId")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
  }

  return res.status(200).json({
    msg: "Tasks fetch successfully",
    data: allTasks,
  });
};

module.exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError(400, "Invalid task ID");
  }

  let foundTask;

  // Owner
  if (req.user.role === "owner") {
    foundTask = await taskModel.findOne({
      _id: taskId,
    });
  }

  // Admin
  else if (req.user.role === "admin") {
    foundTask = await taskModel.findOne({
      _id: taskId,
      organisationId: req.user.organisationId,
    });

    if (!foundTask) {
      throw new AppError(404, "Task does not exist");
    }

    // Verify that this team is managed by this admin
    const foundTeam = await teamModel.findOne({
      _id: foundTask.teamId,
      organisationId: req.user.organisationId,
      adminId: req.user._id,
    });

    if (!foundTeam) {
      throw new AppError(403, "You do not have permission to access this task");
    }
  }

  if (!foundTask) {
    throw new AppError(404, "Task does not exist");
  }

  return res.status(200).json({
    msg: "Task fetched successfully",
    data: foundTask,
  });
};

module.exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError(400, "Invalid task Id");
  }

  const foundTask = await taskModel.findOne({
    _id: taskId,
    organisationId: req.user.organisationId._id,
  });

  if (!foundTask) {
    throw new AppError(404, "Task not found");
  }

  const foundTeam = await teamModel.findOne({
    _id: foundTask.teamId,
    organisationId: req.user.organisationId._id,
    adminId: req.user._id,
  });

  if (!foundTeam) {
    throw new AppError(403, "You do not have access to this task");
  }

  await taskModel.findByIdAndDelete(taskId);

  return res.status(200).json({
    msg: "Task deleted successfully",
  });
};

module.exports.updateTask = async (req, res) => {
  const { taskId } = req.params;

  // Validate Task ID
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError(400, "Invalid Task ID");
  }

  const { title, description, status, priority, teamId, assignedTo, dueDate } =
    req.body;

  // -----------------------------
  // Title validation
  // -----------------------------

  if (
    !title ||
    !title.trim() ||
    title.trim().length < 2 ||
    title.trim().length > 100
  ) {
    throw new AppError(400, "Title must be between 2 and 100 characters");
  }

  // -----------------------------
  // Description validation
  // -----------------------------

  if (!description || !description.trim() || description.trim().length > 1000) {
    throw new AppError(
      400,
      "Description must be between 1 and 1000 characters",
    );
  }

  // -----------------------------
  // Status validation
  // -----------------------------

  if (
    !status ||
    !status.trim() ||
    !["todo", "in-progress", "completed"].includes(status.trim().toLowerCase())
  ) {
    throw new AppError(400, "Invalid status");
  }

  // -----------------------------
  // Priority validation
  // -----------------------------

  if (
    !priority ||
    !priority.trim() ||
    !["low", "medium", "high"].includes(priority.trim().toLowerCase())
  ) {
    throw new AppError(400, "Invalid priority");
  }

  // -----------------------------
  // Team ID validation
  // -----------------------------

  if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
    throw new AppError(400, "Invalid Team ID");
  }

  // -----------------------------
  // Employee ID validation
  // -----------------------------

  if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
    throw new AppError(400, "Invalid Employee ID");
  }

  // -----------------------------
  // Due date validation
  // -----------------------------

  if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
    throw new AppError(400, "Invalid due date");
  }

  // -----------------------------
  // Check Team
  // -----------------------------

  const foundTeam = await teamModel.findOne({
    _id: teamId,
    organisationId: req.user.organisationId._id,
    adminId: req.user._id,
    isActive: true,
  });

  if (!foundTeam) {
    throw new AppError(
      404,
      "Team not found or you do not have access to this team",
    );
  }

  // -----------------------------
  // Check Employee
  // -----------------------------

  const foundEmployee = await userModel.findOne({
    _id: assignedTo,
    role: "employee",
    organisationId: req.user.organisationId._id,
    teamId: teamId,
    isActive: true,
  });

  if (!foundEmployee) {
    throw new AppError(400, "Employee does not belong to the selected team");
  }

  // -----------------------------
  // Update Task
  // -----------------------------

  const updatedTask = await taskModel.findOneAndUpdate(
    {
      _id: taskId,
      organisationId: req.user.organisationId._id,
    },
    {
      title: title.trim(),
      description: description.trim(),
      status: status.trim().toLowerCase(),
      priority: priority.trim().toLowerCase(),
      teamId: foundTeam._id,
      assignedTo: foundEmployee._id,
      dueDate: new Date(dueDate),
    },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );

  // -----------------------------
  // Task not found
  // -----------------------------

  if (!updatedTask) {
    throw new AppError(404, "Task not found");
  }

  return res.status(200).json({
    message: "Task updated successfully",
    data: updatedTask,
  });
};
