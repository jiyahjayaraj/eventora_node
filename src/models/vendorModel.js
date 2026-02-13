const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true
    },

    vendorEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    vendorMobile: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    companyName: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    subscriptionType: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
