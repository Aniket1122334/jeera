const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const authorize = require("../../middlewares/authorize");
const {
  getOwnerDashboardStats,
  getAdminDashboardStats,
} = require("../../controllers/analyticsController/analyticsController");
const router = express.Router();

router.get(
  "/dashboard/owner",
  isLoggedIn,
  authorize("owner"),
  getOwnerDashboardStats,
);

router.get(
  "/dashboard/admin",
  isLoggedIn,
  authorize("admin"),
  getAdminDashboardStats,
);

module.exports = router;
