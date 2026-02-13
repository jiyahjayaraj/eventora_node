const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true
  },
  categoryName: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model("Category", categorySchema);
