const express = require("express");
const router = express.Router();
const recCtrl = require("../controllers/recommendationController");
const { userAuth } = require("../middleware/auth");

// AI generate
router.get("/generate", userAuth, recCtrl.generateRecommendations);

// Community Insights
router.get("/community-insights", userAuth, recCtrl.getCommunityInsights);

// Get stored recommendations
router.get("/user/:userId", recCtrl.getUserRecommendations);

module.exports = router;