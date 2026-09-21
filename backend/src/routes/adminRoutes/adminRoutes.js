const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const authorize = require("../../middlewares/authorize");
const {
  addTeam,
  getAllTeams,
  getTeamById,
  deactivateTeam,
  updateTeam,
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

module.exports = router;
