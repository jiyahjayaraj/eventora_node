const mongoose = require("mongoose");

const eventTypeSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }
}, { timestamps: true });

module.exports = mongoose.model("EventType", eventTypeSchema);