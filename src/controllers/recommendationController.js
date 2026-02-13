const Recommendation = require("../models/recommendationModel");

exports.createRecommendation = async (req, res) => {
  try {
    const rec = await Recommendation.create(req.body);
    res.status(201).json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserRecommendations = async (req, res) => {
  const rec = await Recommendation.findOne({ userId: req.params.userId })
    .populate("recommendedEvents");
  res.json(rec);
};
