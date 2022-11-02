const express = require("express");
const router = express.Router();

const shelfService = require("../services/shelfService");

router.post("/shelve", shelfService.shelveBook);
router.post("/unshelve", shelfService.unshelveBook);
router.post("/updateProgress", shelfService.updateProgress);
router.get("/getShelf", shelfService.getShelf);
router.get("/getUserBookData", shelfService.getUserBookData);
router.get("/getAllUserBooks", shelfService.getAllUserBooks);

module.exports = router;
