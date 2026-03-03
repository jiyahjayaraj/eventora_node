const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, },
  email: { type: String, required: true, unique: true },
  mobile: { type: String,  },
  password: { type: String, required: true },
  location: { type: String,  },
  interests: { type: String,   }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);