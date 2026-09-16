const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");

module.exports.loginUser = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!email) {
    throw new AppError(400, "Email is required");
  }

  if (!password) {
    throw new AppError(400, "Password is required");
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new AppError(403, "Your account is inactive");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      httpOnly: true,
      // secure:true
    })
    .json({
      msg: "User logged in successful",
    });
};

module.exports.logout = async (req, res) => {
  return res.clearCookie("token").status(200).json({
    msg: "User logged out successful",
  });
};

module.exports.me = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    organisationId: user.organisationId,
    teamId: user.teamId,
    isActive: user.isActive,
  };

  return res.status(200).json({
    msg: "User fetched successfully",
    data: userData,
  });
};
