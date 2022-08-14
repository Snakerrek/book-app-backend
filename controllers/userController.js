const express = require("express");
const router = express.Router();

const userService = require("../services/userService");

router.put("/update/:id", userService.updateUser);
router.delete("/delete/:id", userService.deleteUser);
router.get("/get/:id", userService.getUser);

module.exports = router;
