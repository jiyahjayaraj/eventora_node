const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.vendorauth = (req, res, next) => {
  try {
    const token = req.cookies.token;


    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded.id;   
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
