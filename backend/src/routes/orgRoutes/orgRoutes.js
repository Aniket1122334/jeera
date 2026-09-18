const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createOrg,
  getOrgs,
  getOrg,
  deleteOrg,
  updateOrg,
  createAdmin,
  getAllAdmins,
  getAdminById,
  activateAdmin,
  deactivateAdmin,
} = require("../../controllers/orgControllers/orgController");
const authorize = require("../../middlewares/authorize");

/*
  Owner Apis for create Organisation
*/

router.post("/create-org", isLoggedIn, authorize("owner"), createOrg);

router.get("/", isLoggedIn, authorize("owner"), getOrgs);

router.get("/:id", isLoggedIn, authorize("owner"), getOrg);

router.delete("/:id", isLoggedIn, authorize("owner"), deleteOrg);

router.patch("/:id", isLoggedIn, authorize("owner"), updateOrg);

/*
      Owner Apis for create Admin
*/

router.post(
  "/organisation/:id/admin",
  isLoggedIn,
  authorize("owner"),
  createAdmin,
);

router.get(
  "/organisation/:id/admin",
  isLoggedIn,
  authorize("owner"),
  getAllAdmins,
);

router.get("/admin/:id", isLoggedIn, authorize("owner"), getAdminById);

router.patch("/admin/:id", isLoggedIn, authorize("owner"), activateAdmin);
router.delete("/admin/:id", isLoggedIn, authorize("owner"), deactivateAdmin);

module.exports = router;
