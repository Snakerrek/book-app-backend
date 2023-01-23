const express = require("express");
const router = express.Router();

const authService = require("../services/postService");

router.get("/getUserPosts/:userId", authService.getUserPosts);
router.get(
  "/getFollowedUsersPosts/:userId",
  authService.getAllFollowedUsersPosts
);

module.exports = router;
