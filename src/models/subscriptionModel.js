const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },
  plan: {
    type: String,
    enum: ["basic", "professional", "enterprise"],
    default: "basic"
  },
  price: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "expired"],
    default: "active"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  renewalDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
