// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// exports.vendorauth = (req, res, next) => {

//   try {

//     const token = req.cookies.token;


//     if (!token) {
//       return res.status(401).json({
//         message: "Token not found"
//       });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // FIX
//     req.user = decoded;

//     next();

//   } catch (error) {

//     return res.status(401).json({
//       message: "Invalid token"
//     });

//   }

// };


const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ================= USER AUTH ================= */

exports.userAuth = (req, res, next) => {

  try {

    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({
        message: "User token not found"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid user token"
    });

  }

};

/* ================= VENDOR AUTH ================= */

exports.vendorAuth = (req, res, next) => {

  try {

    const token = req.cookies.vendorToken;

    if (!token) {
      return res.status(401).json({
        message: "Vendor token not found"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid vendor token"
    });

  }

};

/* ================= ADMIN AUTH ================= */

exports.adminAuth = (req, res, next) => {

  try {

    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        message: "Admin token not found"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid admin token"
    });

  }

};