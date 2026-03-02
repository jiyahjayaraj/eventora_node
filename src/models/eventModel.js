const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
{
  eventName: {
    type: String,
    required: true
  },

  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventType",
    required: true
  },

  description: {
    type: String
  },

  bannerImage: {
    type: String
  },

  // LOCATION
  city: {
    type: String,
    required: true
  },

  eventLocation: {
    type: String,
    required: true
  },

  // DATE & TIME
  eventDate: {
    type: Date,
    required: true
  },

  startTime: {
    type: String,
    required: true
  },

  endTime: {
    type: String,
    required: true
  },

  // TICKETING
  price: {
    type: Number,
    default: 0
  },

  totalTickets: {
    type: Number,
    default: 0
  },

  // EARLY BIRD
  earlyPrice: {
    type: Number
  },

  earlyDeadline: {
    type: Date
  },

  // STATUS
  status: {
    type: String,
    enum: ["draft", "active", "cancelled"],
    default: "draft"
  },

  // VENDOR LINK
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },

  // FEEDBACK
  feedbacks: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      comment: {
        type: String
      },

      rating: {
        type: Number,
        min: 1,
        max: 5
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

},
{ timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);