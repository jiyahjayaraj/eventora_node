const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  recommendedEvents: [
    {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      },
      matchScore: Number
    }
  ],

  generatedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Recommendation", recommendationSchema);