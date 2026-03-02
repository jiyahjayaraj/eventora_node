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

    eventDate: {
      type: Date,
      required: true
    },
    // Event model
    bannerImage: {
      type: String
    },


    eventLocation: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    totalTickets: {
      type: Number,
      // required: true
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["draft", "active", "cancelled"],
      default: "draft"
    },

    // 🔗 LINK TO VENDOR
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },

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
