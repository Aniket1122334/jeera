const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const AddOwner = async (name, password, email) => {
  let pw = await bcrypt.hash(password, 10);

  await userModel.create({
    name: name,
    email: email,
    password: pw,
    role: "owner",
  });
};

module.exports = AddOwner;
