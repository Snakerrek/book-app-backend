const express = require("express");
const router = express.Router();

const shelfService = require("../services/shelfService");

router.post("/shelve", shelfService.shelveBook);
router.post("/unshelve", shelfService.unshelveBook);
router.post("/updateProgress", shelfService.updateProgress);
router.post("/getShelf", shelfService.getShelf);
router.post("/getUserBookData", shelfService.getUserBookData);
router.post("/getAllUserBooks", shelfService.getAllUserBooks);

module.exports = router;
