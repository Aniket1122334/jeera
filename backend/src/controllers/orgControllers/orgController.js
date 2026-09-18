const { default: mongoose } = require("mongoose");
const orgModel = require("../../models/orgModel");
const AppError = require("../../utils/AppError");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");

/*
  Owner controller for create Organisation
*/

module.exports.createOrg = async (req, res) => {
  const { name, isActive } = req.body;

  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    throw new AppError(400, "Invalid organization name");
  }

  const createdOrg = await orgModel.create({
    name,
    isActive,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    msg: "Organisation is created successfully",
    data: createdOrg,
  });
};

module.exports.getOrgs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  skip = Number(page);
  limit = Number(limit);

  const data = await orgModel
    .find()
    .limit(limit)
    .skip((page - 1) * limit);

  return res.status(200).json({
    msg: "Organisations fetch successfully",
    data,
  });
};

module.exports.getOrg = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const findOrg = await orgModel.findById(id);

  if (!findOrg) {
    throw new AppError(404, "Organisation not found");
  }

  return res.status(200).json({
    msg: "Organization fetched successfully",
    data: findOrg,
  });
};

module.exports.deleteOrg = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const data = await orgModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { returnDocument: "after" },
  );

  if (!data) {
    throw new AppError(404, "Organisation does not exists");
  }

  return res.status(200).json({
    msg: "Organisation Deleted Successfully",
    data,
  });
};

module.exports.updateOrg = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const { name, isActive } = req.body;

  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    throw new AppError(400, "Invalid Name");
  }
  const data = await orgModel.findByIdAndUpdate(
    id,
    { name, isActive },
    { runValidators: true, returnDocument: "after" },
  );

  if (!data) {
    throw new AppError(404, "Organisation does not exists");
  }

  res.status(200).json({
    msg: "Organisation Updated Successfully",
    data,
  });
};

/*
      Owner controllers for create Admin
*/

module.exports.createAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const { email, password, name } = req.body;

  if (!name.trim() || name.trim().length > 20 || name.trim().length < 2) {
    throw new AppError(400, "Invalid name");
  }

  if (!validator.isEmail(email)) {
    throw new AppError(400, `${email} is not a valid email`);
  }

  if (!validator.isStrongPassword(password)) {
    throw new AppError(400, `${password} is not a strong password`);
  }

  const foundOrg = await orgModel.findById(id);

  if (!foundOrg) {
    throw new AppError(404, "Organisation does not exists");
  }

  // if (!foundOrg.isActive) {
  //   throw new Error(400, "Organisation Inactive");
  // }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdAdmin = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    organisationId: id,
    isActive: foundOrg.isActive,
  });

  res.status(201).json({
    msg: foundOrg.isActive
      ? `Admin created under organisation ${foundOrg.name}`
      : `Admin created under organisation ${foundOrg.name} which is currently INACTIVE`,
    data: createdAdmin,
  });
};

module.exports.getAllAdmins = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const foundOrg = await orgModel.findById(id);

  if (!foundOrg) {
    throw new AppError(404, "Organisation does not exists");
  }

  const foundAdmins = await userModel
    .find({
      organisationId: foundOrg._id,
      role: "admin",
    })
    .select("-organisationId");

  res.status(200).json({
    msg: foundOrg.isActive ? "Organiation ACTIVE" : "Organisation INACTIVE",
    data: foundAdmins,
  });
};

module.exports.getAdminById = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const foundUser = await userModel.findById(id);

  if (!foundUser) {
    throw new AppError(404, "User does not exists");
  }

  const foundOrg = await orgModel.findById(foundUser.organisationId);

  res.status(200).json({
    data: foundUser,
    message: foundOrg.isActive
      ? `Organization ACTIVE`
      : `Organization INACTIVE`,
  });
};

module.exports.activateAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const foundUser = await userModel.findById(id);

  if (!foundUser) {
    throw new AppError(404, "User does not exists");
  }

  foundUser.isActive = true;

  await foundUser.save();

  res.status(200).json({
    message: `${foundUser.name} activated successfully`,
    data: foundUser,
  });
};

module.exports.deactivateAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid ID");
  }

  const foundUser = await userModel.findById(id);

  if (!foundUser) {
    throw new AppError(404, "User does not exists");
  }

  foundUser.isActive = false;

  await foundUser.save();

  res.status(200).json({
    message: `${foundUser.name} deactivated successfully`,
    data: foundUser,
  });
};
