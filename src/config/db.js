const mongoose = require("mongoose");
require('dotenv').config();

const dbURI = process.env.DB_URI;
console.log(dbURI);

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("success");
  } catch (error) {
    console.error("DB error:", error.message);
  }
};

connectDB();
