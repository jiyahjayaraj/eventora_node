const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      unique: true,              // ✅ CRITICAL
      index: true
    },

    plan: {
      type: String,
      enum: ["basic", "professional", "enterprise"],
      default: "basic"
    },

    price: {
      type: Number,
      required: true,            // ✅ enforce consistency
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
      type: Date,
      required: true             // ✅ prevents invalid UI state
    }
  },
  {
    timestamps: true
  }
);

/**
 * 🔁 Auto-expire subscription if renewal date passed
 */
subscriptionSchema.pre("save", function (next) {
  if (
    this.renewalDate &&
    this.renewalDate < new Date() &&
    this.status === "active"
  ) {
    this.status = "expired";
  }
  next();
});

module.exports = mongoose.model("Subscription", subscriptionSchema);