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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Create JWT (same structure as vendor)
    const user_token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Set cookie (same options as vendor)
    res.cookie("token", user_token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    // ✅ Response
    res.status(200).json({
      message: "User login successful",
      user_token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("USER LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role
  });
};
