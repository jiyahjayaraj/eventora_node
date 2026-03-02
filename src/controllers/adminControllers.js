const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EventType = require("../models/eventType");
const Vendor = require("../models/vendorModel");

/* ================= CREATE VENDOR ================= */

exports.createVendor = async (req, res) => {
  try {

    const {
      vendorName,
      vendorEmail,
      password,
    } = req.body;

    if (
      !vendorName ||
      !vendorEmail ||
      !password 
    ) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const exists = await Vendor.findOne({ vendorEmail });

    if (exists) {
      return res.status(409).json({
        message: "Vendor already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({

      vendorName,
      vendorEmail,
      password: hashedPassword,
    });

    res.status(201).json({

      message: "Vendor created successfully",
      vendor

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Vendor creation failed"
    });

  }

};
/* ================= REGISTER ADMIN ================= */
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      message: "Admin registered",
      admin: adminResponse
    });

  } catch (error) {
    res.status(500).json({ message: "Admin register failed" });
  }
};

/* ================= LOGIN ADMIN ================= */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Admin login success",token });

  } catch (error) {
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* ================= GET ALL ADMINS ================= */
exports.getAdmins = async (req, res) => {
   const admid = req.user;
   
  try {
  console.log(admid);
    const admin =await Admin.findById(admid).select("-password")
    console.log(admin);
    if(!admin) res.send("admin not found")
  
      res.status(200).json(admin)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};
/* ================= CREATE EVENT TYPE ================= */

exports.createEventType = async (req, res) => {
  try {

    const { name} = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Event type name required"
      });
    }

    const exists = await EventType.findOne({ name });

    if (exists) {
      return res.status(409).json({
        message: "Event type already exists"
      });
    }

    const eventType = await EventType.create({
      name,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Event type created successfully",
      data: eventType
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create event type"
    });

  }
};
exports.getEventTypes = async (req, res) => {
  try {

    const eventTypes = await EventType.find().sort({ name: 1 });

    res.json({
      data: eventTypes
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch event types"
    });

  }
};