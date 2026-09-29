const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const authorize = require("../../middlewares/authorize");
const {
  getOwnerDashboardStats,
} = require("../../controllers/analyticsController/analyticsController");
const router = express.Router();

router.get(
  "/dashboard",
  isLoggedIn,
  authorize("owner"),
  getOwnerDashboardStats,
);

module.exports = router;
