const express = require("express");
const router = express.Router();

const authService = require("../services/authService");

router.post("/register", authService.registerUser);
router.post("/login", authService.loginUser);

module.exports = router;
