const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  recommendationId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recommendedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
