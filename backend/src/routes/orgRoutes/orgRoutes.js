const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createOrg,
  getOrgs,
  getOrg,
  deleteOrg,
  updateOrg,
} = require("../../controllers/orgControllers/orgController");
const authorize = require("../../middlewares/authorize");

router.post("/create-org", isLoggedIn, authorize("owner"), createOrg);

router.get("/", isLoggedIn, authorize("owner"), getOrgs);

router.get("/:id", isLoggedIn, authorize("owner"), getOrg);

router.delete("/:id", isLoggedIn, authorize("owner"), deleteOrg);

router.patch("/:id", isLoggedIn, authorize("owner"), updateOrg);

module.exports = router;
