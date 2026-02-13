const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true
    },

    eventType: {
      type: String,
      enum: ["Wedding", "Birthday", "Corporate", "Tech", "Music"],
        // required: true
    },

    eventDate: {
      type: Date,
      required: true
    },
    // Event model
    bannerImage: {
      type:String
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
