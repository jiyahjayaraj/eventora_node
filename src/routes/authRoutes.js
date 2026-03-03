const express = require("express");
const passport = require("passport");
const router = express.Router();

/* ===============================
   1️⃣ GOOGLE LOGIN START
================================= */
router.get("/auth/google", (req, res, next) => {
  const redirect = req.query.redirect || "/";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect, // 👈 pass redirect page
  })(req, res, next);
});


/* ===============================
   2️⃣ GOOGLE CALLBACK
================================= */
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    // 🔥 Set JWT token in cookie
    res.cookie("token", req.user.token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
    });

    // 👇 Get redirect page
    const redirectUrl = req.query.state || "/";

    // Redirect to frontend
    res.redirect(`http://localhost:3000${redirectUrl}`);
  }
);


/* ===============================
   3️⃣ CHECK AUTH
================================= */
router.get("/check-auth", (req, res) => {
  if (req.cookies.token) {
    return res.json({ loggedIn: true });
  }
  res.status(401).json({ loggedIn: false });
});


/* ===============================
   4️⃣ LOGOUT
================================= */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});


module.exports = router;