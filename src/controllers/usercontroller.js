const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/* ======================
   USER REGISTER
====================== */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password,location,interests} = req.body;

    // 🔒 basic safety check
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).send("User already exists" );

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      location,
      interests
    });

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("REGISTER USER ERROR 👉", error);
    res.status(500).json({ message: "Registration failed" });
  }
  
};

/* ======================
   LOGIN
====================== */

exports.login = async (req, res) => {
  console.log(req.body);
  
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role
  });
};
