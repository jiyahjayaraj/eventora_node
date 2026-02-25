const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const {vendorauth} = require("../middleware/auth");

// User auth
router.post("/users/register", userController.registerUser);
router.post("/users/login", userController.login);

// Get logged-in user profile
router.get("/profile",vendorauth, userController.getProfile);

module.exports = router;
