const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      unique: true
    },

    plan: {
      type: String,
      enum: ["basic", "professional", "enterprise"],
      default: "basic",
      required: true
    },

    price: {
      type: Number,
      min: 0,
      default: 0,
      required: true
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
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);


/*
  Only ONE subscription per vendor
*/
// subscriptionSchema.index({ vendor: 1 }, { unique: true });


/*
  Auto-expire on save
*/
subscriptionSchema.pre("save", function (next) {
  if (this.status === "active" && this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});


/*
  Auto-expire on update (VERY IMPORTANT)
*/
subscriptionSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (
    update.status === "active" &&
    update.renewalDate &&
    update.renewalDate < new Date()
  ) {
    update.status = "expired";
  }
});


module.exports = mongoose.model("Subscription", subscriptionSchema);