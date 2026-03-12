const Recommendation = require("../models/recommendationModel");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const getAIRecommendations = require("../services/geminiService");

exports.generateRecommendations = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Fetch events
    const events = await Event.find({ status: "active" }).limit(20);

    if (!events.length) {
      return res.json({
        message: "No events available"
      });
    }

    // Call Gemini
    const aiResponse = await getAIRecommendations(user, events);

    // Clean AI response
    const cleaned = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // Format recommendations
    const recommendedEvents = parsed.map((r) => ({
      event: r.eventId,
      matchScore: r.match
    }));

    // Save to DB
    const recommendation = await Recommendation.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        recommendedEvents,
        generatedAt: Date.now()
      },
      {
        upsert: true,
        new: true
      }
    ).populate("recommendedEvents.event");

    res.json(recommendation);

  } catch (error) {

    console.error("AI Recommendation Error:", error);

    res.status(500).json({
      message: "AI recommendation failed"
    });

  }

};

exports.getUserRecommendations = async (req, res) => {

  try {

    const recommendation = await Recommendation
      .findOne({ userId: req.params.userId })
      .populate("recommendedEvents.event");

    if (!recommendation) {
      return res.status(404).json({
        message: "No recommendations found"
      });
    }

    res.json(recommendation);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch recommendations"
    });

  }

};