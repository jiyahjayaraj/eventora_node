const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminControllers");

// Public
router.post("/register", adminCtrl.registerAdmin);
router.post("/login", adminCtrl.loginAdmin);

// 🔐 Protected (ADMIN ONLY, uses cookies)
router.get("/admin_dashboard",adminCtrl.getAdmins);

module.exports = router;
