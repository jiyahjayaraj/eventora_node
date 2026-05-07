const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // ✅ Added

// REGISTER + AUTO LOGIN
exports.registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      mobile,
      city,
      interests,
      latitude,
      longitude
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      city,
      interests,

      location:
  latitude && longitude
    ? {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    : undefined
    });

   const token = jwt.sign(
  {
    id: user._id,
    role: "user"
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.status(201).json({
      message: "User registered & logged in",
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
  {
    id: user._id,
    role: "user"
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// LOGOUT USER
exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};