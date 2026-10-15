const express = require("express");
const router = express.Router();

const {
  adminChats,
  employeeChats,
  getMessages,
  getUnreadCounts,
} = require("../../controllers/chatControllers/chatControllers");

const isLoggedIn = require("../../middlewares/isLoggedIn");
const authorize = require("../../middlewares/authorize");
const isOrganisationActive = require("../../middlewares/isOrganisationActive");

// Admin - see all active users of same organization
router.get(
  "/admin",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin"),
  adminChats,
);

// Employee - see only active users of same team
router.get("/employee", isLoggedIn, authorize("employee"), employeeChats);

router.get(
  "/messages/:receiverId",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "employee"),
  getMessages,
);

router.get(
  "/unread-counts",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "employee"),
  getUnreadCounts,
);

module.exports = router;
