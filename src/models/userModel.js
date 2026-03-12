const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },

  email: {
    type: String,
    required: true,
    unique: true
  },

  mobile: { type: String },

  password: {
    type: String,
    required: true
  },

  // USER CITY
  city: { type: String },

  // GEO LOCATION (for nearby events)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },

  // USER INTERESTS (multiple)
 interests: [{
  type: String
}]

}, { timestamps: true });

// Geo index for location search
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);