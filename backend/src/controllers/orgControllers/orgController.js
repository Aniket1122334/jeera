const { default: mongoose } = require("mongoose");
const orgModel = require("../../models/orgModel");
const AppError = require("../../utils/AppError");

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
