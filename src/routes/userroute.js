    const express = require("express");
    const router = express.Router();
    const userController = require("../controllers/usercontroller");
    const {userAuth} = require("../middleware/auth");

    // User auth
    router.post("/users/register", userController.registerUser);
    router.post("/users/login", userController.loginUser);
    router.post("/users/logout", userController.logoutUser); // ✅ ADDED

    // Get logged-in user profile
    router.get("/profile",userAuth, userController.getProfile);

    module.exports = router;
