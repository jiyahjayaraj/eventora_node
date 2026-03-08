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
    },

    address: {
      type: String,
    },

    companyName: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    password: {
      type: String,
      required: true
    },

    subscriptionType: {
      type: String,
    },
    profileImage: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);