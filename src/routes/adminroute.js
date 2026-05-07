const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminControllers");
const {adminAuth} = require("../middleware/auth");

// Public
router.post("/register", adminCtrl.registerAdmin);
router.post("/login", adminCtrl.loginAdmin);
router.post("/eventtypes",adminAuth,adminCtrl.createEventType);
router.get("/eventtypes", adminCtrl.getEventTypes);
router.post("/createvendor",adminCtrl.createVendor);
router.put("/updatevendor/:id", adminCtrl.updateVendor);
router.post("/subscription", adminAuth, adminCtrl.adminUpsertSubscription);
// 🔐 Protected (ADMIN ONLY, uses cookies)
router.get("/admin_dashboard",adminAuth,adminCtrl.getProfile);

module.exports = router;
