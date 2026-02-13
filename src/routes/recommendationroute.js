const express = require("express");
const router = express.Router();
const recCtrl = require("../controllers/recommendationController");

router.post("/create", recCtrl.createRecommendation);
router.get("/user/:userId", recCtrl.getUserRecommendations);

module.exports = router;
