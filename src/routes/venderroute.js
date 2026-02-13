const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorcontroller");
const {vendorauth} = require("../middleware/auth");
// Vendor auth
router.post("/vendors/register", vendorController.registerVendor);
router.post("/vendors/login", vendorController.login);

// Get vendor profile
router.get("/vendor_dashboard", vendorauth,vendorController.getProfile);

// Get all events created by this vendor
router.get("/events", vendorauth,vendorController.getMyEvents);

module.exports = router;
