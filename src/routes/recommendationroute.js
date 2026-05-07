const express = require("express");
const router = express.Router();
const recCtrl = require("../controllers/recommendationController");
const { vendorauth } = require("../middleware/auth");

// AI generate
router.get("/generate", vendorauth, recCtrl.generateRecommendations);

// Community Insights
router.get("/community-insights", vendorauth, recCtrl.getCommunityInsights);

// Get stored recommendations
router.get("/user/:userId", recCtrl.getUserRecommendations);

module.exports = router;