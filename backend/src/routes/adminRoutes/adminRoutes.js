const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const authorize = require("../../middlewares/authorize");
const {
  addTeam,
  getAllTeams,
  getTeamById,
  deactivateTeam,
  updateTeam,
  createEmployee,
  getEmployeesById,
  deleteEmployee,
  updateEmployee,
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask,
} = require("../../controllers/adminControllers/adminController");
const isOrganisationActive = require("../../middlewares/isOrganisationActive");
const router = express.Router();

router.post(
  "/teams",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin"),
  addTeam,
);

router.get(
  "/teams",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "owner"),
  getAllTeams,
);

router.get(
  "/teams/:id",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "owner"),
  getTeamById,
);

router.delete(
  "/teams/:id",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "owner"),
  deactivateTeam,
);

router.patch(
  "/teams/:id",
  isLoggedIn,
  authorize("owner", "admin"),
  isOrganisationActive,
  updateTeam,
);

/*

-- Admin apis for employess

*/

router.post(
  "/teams/:teamId/employee",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin"),
  createEmployee,
);

router.get(
  "/teams/:teamId/employee",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "owner"),
  getEmployeesById,
);

router.delete(
  "/employees/:employeeId",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "owner"),
  deleteEmployee,
);

router.patch(
  "/employees/:employeeId",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "owner"),
  updateEmployee,
);

/*

Admin task apis

*/

router.post(
  "/tasks/employee/:employeeId",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin"),
  createTask,
);

router.get(
  "/tasks",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin"),
  getAllTasks,
);

router.get(
  "/tasks/:taskId",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin", "owner"),
  getTaskById,
);

router.delete(
  "/tasks/:taskId",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin"),
  deleteTask,
);

router.patch(
  "/tasks/:taskId",
  isLoggedIn,
  isOrganisationActive,
  authorize("admin"),
  updateTask,
);

module.exports = router;
