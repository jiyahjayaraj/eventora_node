const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminControllers");
const {vendorauth} = require("../middleware/auth");

// Public
router.post("/register", adminCtrl.registerAdmin);
router.post("/login", adminCtrl.loginAdmin);
router.post("/eventtypes",vendorauth,adminCtrl.createEventType);
router.get("/eventtypes", adminCtrl.getEventTypes);
router.post("/createvendor",adminCtrl.createVendor)
// 🔐 Protected (ADMIN ONLY, uses cookies)
router.get("/admin_dashboard",adminCtrl.getAdmins);

module.exports = router;
