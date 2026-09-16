const express = require("express");
const {
  loginUser,
  logout,
  me,
} = require("../../controllers/authControllers/authControllers");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", isLoggedIn, logout);
router.get("/me", isLoggedIn, me);

module.exports = router;
