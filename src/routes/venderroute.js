const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorcontroller");
const {vendorauth} = require("../middleware/auth");

router.post("/vendors/login", vendorController.login);
router.put("/updateProfile",vendorauth,vendorController.updateProfile);
router.get("/vendor_dashboard", vendorauth,vendorController.getProfile);
router.post("/apply", vendorController.sendVendorApplication);
router.get("/vendors", vendorController.getAllVendors);

module.exports = router;
