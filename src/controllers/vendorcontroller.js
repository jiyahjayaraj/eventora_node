const Vendor = require("../models/vendorModel");
const Event = require("../models/eventModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/* ======================
   VENDOR REGISTER
====================== */
exports.registerVendor = async (req, res) => {
  console.log(req.body);
  
  try {
    const {
      vendorName,
      vendorEmail,
      vendorMobile,
      password,
      address,
      subscriptionType,
      companyName
    } = req.body;

    if (
      !vendorName ||
      !vendorEmail ||
      !vendorMobile ||
      !password ||
      !address ||
      !subscriptionType ||
      !companyName
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVendor = await Vendor.findOne({ vendorEmail });
    if (existingVendor) {
      return res.status(409).json({ message: "Vendor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Vendor.create({
      vendorId: `VEN-${Date.now()}`, // ✅ auto-generate
      vendorName,
      vendorEmail,
      vendorMobile,
      address,
      companyName,
      password: hashedPassword,
      subscriptionType
    });

    res.status(201).json({
      message: "Vendor registered successfully. Waiting for admin approval"
    });

  } catch (error) {
    console.error("REGISTER VENDOR ERROR 👉", error);
    res.status(500).json({ message: "Vendor registration failed" });
  }
};

/* ======================
   LOGIN
====================== */
exports.login = async (req, res) => {
  try {
    const { vendorEmail, password } = req.body;

    if (!vendorEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const vendor = await Vendor.findOne({ vendorEmail });
    if (!vendor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const vendor_token = jwt.sign(
      { id: vendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    
    res.cookie("token", vendor_token, {
      httpOnly: true,
      secure: false, // true only in production https
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Vendor login successful",
      vendor_token,
      vendor: {
        id: vendor._id,
        vendorName: vendor.vendorName,
        vendorEmail: vendor.vendorEmail
      }
    });

  } catch (error) {
    console.error("VENDOR LOGIN ERROR ", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* ======================
   GET VENDOR PROFILE
====================== */
exports.getProfile = async (req, res) => {
  const vendorId = req.user; // 👈 SAME as admin

  try {

    const vendor = await Vendor.findById(vendorId).select("-password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendor profile" });
  }
};


/* ======================
   GET VENDOR EVENTS
====================== */
exports.getMyEvents = async (req, res) => {
  const events = await Event.find({ vendorId: req.user.id });
  res.json(events);
};
