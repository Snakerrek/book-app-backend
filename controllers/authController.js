const express = require("express");
const router = express.Router();

const authService = require("../services/authService");

router.post("/register", authService.registerUser);
router.post("/login", authService.loginUser);
router.get("/isUserAuth", authService.verifyJWT, (req, res) => {
  res.status(200).json({ isLoggedIn: true, username: req.user.username });
});

module.exports = router;
