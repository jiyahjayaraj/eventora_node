require("dotenv").config();
const cors=require("cors")
const express = require("express");
const path = require("path");

const app = express();
const cookieParser = require("cookie-parser");

// DB connection (VERY IMPORTANT)
require("./src/config/db"); // adjust if db.js is elsewhere

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:["http://localhost:3000","http://localhost:3001"],
  credentials:true
}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "upload")));

// Routes (FIXED PATHS)
// const authRoutes = require("./src/routes/authrouter");
const userRoutes = require("./src/routes/userroute");
const vendorRoutes = require("./src/routes/venderroute");
const eventRoutes = require("./src/routes/eventrouter");
const orderRoutes = require("./src/routes/order");
const revenueRoutes = require('./src/routes/revenueRoutes');
const subscriptionRoutes = require("./src/routes/subscriptionRoute")

app.use("/api", require("./src/routes/adminroute"));


// Use routes
// app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", vendorRoutes);
app.use("/api", eventRoutes);
app.use("/api", orderRoutes);
app.use('/api', revenueRoutes);
app.use('/api',subscriptionRoutes)
app.use("/api", require("./src/routes/ticketroute"));
app.use("/api/payments", require("./src/routes/paymentroute"));
app.use("/api/categories", require("./src/routes/categoryroute"));
app.use("/api/recommendations", require("./src/routes/recommendationroute"));


// Port
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log("Server running on port:", port);
  
});
