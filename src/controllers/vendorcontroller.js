const Vendor = require("../models/vendorModel");
const Event = require("../models/eventModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const nodemailer = require("nodemailer"); // ✅ ADD THIS
require("dotenv").config(); // ✅ Added


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
        vendorEmail: vendor.vendorEmail,
        vendorMobile: vendor.vendorMobile,
        companyName: vendor.companyName,
        companyAddress: vendor.companyAddress,
        city: vendor.city,
        state: vendor.state,
        pincode: vendor.pincode
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
  const vendorId = req.user;   // ✅ correct (already id)

  try {
    const vendor = await Vendor.findById(vendorId).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch vendor profile" });
  }
};

/* ======================
   UPDATE VENDOR PROFILE
====================== */
exports.updateProfile = async (req, res) => {

  const vendorId = req.user;

  try {

    const updateData = {
      vendorMobile: req.body.vendorMobile,
      companyName: req.body.companyName,
      companyAddress: req.body.companyAddress,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode
    };

    // ✅ Handle password update
    if (req.body.password && req.body.password.trim() !== "") {

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      updateData.password = hashedPassword;
    }

    // ✅ Handle profile image
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      vendor: updatedVendor
    });

  } catch (error) {

    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update profile"
    });

  }
};

/* ======================
   GET VENDOR EVENTS
====================== */
exports.getMyEvents = async (req, res) => {
  const events = await Event.find({ vendorId: req.user.id });
  res.json(events);
};

/* ======================
   SEND VENDOR APPLICATION MAIL (NEW)
====================== */
exports.sendVendorApplication = async (req, res) => {
  try {
    const { name, email, phone, organization, eventType } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: `"Eventora Vendor Request" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Vendor Application - Eventora",
      html: `
        <h2>New Vendor Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
      `,
    });

    res.status(200).json({ message: "Application sent successfully" });

  } catch (error) {
    console.error("====== MAIL ERROR START ======");
    console.error(error);
    console.error("====== MAIL ERROR END ======");

    res.status(500).json({
      message: "Failed to send application",
      error: error.message
    });
  }
};

/* ================= GET ALL VENDORS ================= */

exports.getAllVendors = async (req, res) => {
  try {

    const vendors = await Vendor.find();

    res.status(200).json({
      vendors
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch vendors"
    });

  }
};