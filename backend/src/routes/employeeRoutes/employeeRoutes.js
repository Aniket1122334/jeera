const express = require("express");
const isOrganisationActive = require("../../middlewares/isOrganisationActive");
const authorize = require("../../middlewares/authorize");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  getAllTasksByEmployee,
  getTaskByIdByEmployee,
  updateTaskByEmployee,
} = require("../../controllers/employeeController/employeeController");
const isTeamActivate = require("../../middlewares/isTeamActivate");
const router = express.Router();

router.get(
  "/tasks",
  isLoggedIn,
  authorize("employee", "owner"),
  isOrganisationActive,
  isTeamActivate,
  getAllTasksByEmployee,
);

router.get(
  "/tasks/:taskId",
  isLoggedIn,
  authorize("employee", "owner"),
  isOrganisationActive,
  isTeamActivate,
  getTaskByIdByEmployee,
);

router.patch(
  "/tasks/:taskId",
  isLoggedIn,
  authorize("employee", "owner"),
  isOrganisationActive,
  isTeamActivate,
  updateTaskByEmployee,
);

module.exports = router;
