const express = require("express");
const router = express.Router();

const userService = require("../services/userService");

router.put("/update/:id", userService.updateUser);
router.put("/updateAvatar/:id", userService.updateUserAvatar);
router.delete("/delete/:id", userService.deleteUser);
router.get("/get/:id", userService.getUser);
router.get("/getAllUsers", userService.getAllUsers);

module.exports = router;
