const Recommendation = require("../models/recommendationModel");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Order = require("../models/order");
const EventType = require("../models/eventType");
const getAIRecommendations = require("../services/geminiService");

exports.generateRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user); // req.user is usually the ID from auth
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User coordinates:", user.location?.coordinates);

    // Default: basic find without distance
    let events = [];

    if (
      user.location?.coordinates &&
      user.location.coordinates.length === 2
    ) {

      console.log("User has coordinates, running aggregate...");
      // User has location: find active events within 100km, sorted by proximity
      events = await Event.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [
                user.location.coordinates[0], // longitude
                user.location.coordinates[1]  // latitude
              ]
            },
            distanceField: "distance", // Injects distance in meters
            maxDistance: 100 * 1000, // 100km radius max
            spherical: true,
            query: { status: "active" }
          }
        },
        { $limit: 50 },
        {
          $lookup: {
            from: "eventtypes", // 'eventtypes' is the collection name for EventType model
            localField: "eventType",
            foreignField: "_id",
            as: "eventTypeDetails"
          }
        },
        {
          $addFields: {
            eventType: { $arrayElemAt: ["$eventTypeDetails", 0] },
            distance: { $divide: ["$distance", 1000] }, // Convert meters to km
            id: "$_id" // Ensure string ID map matches
          }
        },
        {
          $project: {
            eventTypeDetails: 0 // cleanup
          }
        }
      ]);
    } else {
      // Fallback if user has no location saved
      events = await Event.find({ status: "active" })
        .populate("eventType", "name")
        .limit(50);
    }

    if (!events || events.length === 0) {
      console.log("No active events found for user.");
      return res.json({ message: "No active events available for recommendation." });
    }

    console.log("Found events:", events.length, ". Calling Gemini...");
    // Call Gemini with Fallback
    let recommendedEvents = [];
    try {
      console.log("Calling Gemini...");
      const aiResponse = await getAIRecommendations(user, events);
      console.log("Gemini raw response received.");

      let cleaned = aiResponse.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleaned);
      recommendedEvents = parsed.map((r) => ({
        event: r.eventId,
        matchScore: r.match
      }));
    } catch (aiError) {
      console.error("Gemini failed (Quota/Limit), using fallback:", aiError.message);
      // Fallback: Use the first 5 events found with descending match scores
      recommendedEvents = events.slice(0, 5).map((e, index) => ({
        event: e._id || e.id,
        matchScore: 90 - (index * 5) // Mock scores: 90, 85, 80...
      }));
    }

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

    console.log("Recommendation Response generated (using " + (recommendedEvents.length > 0 ? "AI/Fallback" : "none") + ").");

    console.log("Recommendation Response generated.");

    res.json(recommendation);

  } catch (error) {
    console.error("AI Recommendation Error Details:", error.status, error.message, error.response?.data);
    res.status(500).json({ 
      message: "AI recommendation failed", 
      details: error.message 
    });
  }
};

exports.getUserRecommendations = async (req, res) => {
  try {
    const recommendation = await Recommendation
      .findOne({ userId: req.params.userId || req.user })
      .populate("recommendedEvents.event");

    if (!recommendation) {
      return res.status(404).json({ message: "No recommendations found" });
    }

    res.json(recommendation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};

// --- NEW OVERALL COMMUNITY INSIGHTS ---
exports.getCommunityInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userInterests = user.interests || [];

    // Find other users with similar interests (at least one matching interest)
    const similarUsers = await User.find({
      _id: { $ne: user._id },
      interests: { $in: userInterests }
    }).select("_id");

    const similarUserIds = similarUsers.map(u => u._id);

    if (similarUserIds.length === 0) {
      return res.json([]); // No similar users found
    }

    // Find popular events among similar users via Orders
    const popularEvents = await Order.aggregate([
      { $match: { userId: { $in: similarUserIds }, paymentStatus: "paid" } },
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const eventIds = popularEvents.map(e => e._id);
    const populatedEvents = await Event.find({ _id: { $in: eventIds } });

    res.json(populatedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch community insights" });
  }
};