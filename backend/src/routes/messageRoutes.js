const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isOrganisationActive = require("../middlewares/isOrganisationActive");
const authorize = require("../middlewares/authorize");
const { getTeamMessages, createTeamMessage } = require("../controllers/messageController");

const router = express.Router();
router.get("/teams/:teamId/messages", isLoggedIn, isOrganisationActive, authorize("admin", "employee"), getTeamMessages);
router.post("/teams/:teamId/messages", isLoggedIn, isOrganisationActive, authorize("admin", "employee"), createTeamMessage);
module.exports = router;
