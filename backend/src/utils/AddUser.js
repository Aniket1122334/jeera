const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const AddUser = async (name, password, email, role) => {
  let pw = await bcrypt.hash(password, 10);

  await userModel.create({
    name: name,
    email: email,
    password: pw,
    role: role,
  });
};

module.exports = AddUser;
